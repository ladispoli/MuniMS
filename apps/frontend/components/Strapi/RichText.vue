<!-- Render HTML from strapi (using Ckeditor plugin) -->
<template>
  <div></div>
</template>

<script lang="ts">
import type { RendererElement, RendererNode } from 'vue';
import { parseDocument } from 'htmlparser2';

interface NodeToReplace {
  element?: string;
  props?: Record<string, string>;
  vNode: (
    props: Record<string, unknown>,
    children?: string | VNode<RendererNode, RendererElement> | null,
  ) => VNode<RendererNode, RendererElement>;
}

const Icon = resolveComponent('Icon');
const NuxtLink = resolveComponent('NuxtLink');

export default {
  props: {
    html: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    // set base url for strapi media
    const uploadsPath = useStrapiMediaUrl('/uploads/');
    const html = props.html.replace(/".*?(?=\/uploads\/)/gi, `"${uploadsPath}`);

    const nodesToReplace: Array<NodeToReplace> = [
      {
        element: 'a',
        vNode: (props, children) => {
          const href = props.href as string;
          const title = props.title as string;

          if (href.startsWith('tel:')) {
            return h('span', { class: 'font-sans-serif' }, [
              h(Icon, { name: 'it-telephone', size: 'sm' }),
              h(NuxtLink, { href: href.replace(/[\s-]/g, ''), title }, [children]),
            ]);
          }
          if (href.startsWith('mailto:')) {
            return h('span', { class: 'font-sans-serif' }, [
              h(Icon, { name: 'it-mail', size: 'sm' }),
              h(NuxtLink, { href, title }, [children]),
            ]);
          }
          if (href.startsWith(uploadsPath)) {
            return h('span', { class: 'font-sans-serif' }, [
              h(Icon, { name: 'it-clip', size: 'sm' }),
              h(NuxtLink, { href, title, target: '_blank', download: true }, [children]), // set base url for strapi media
            ]);
          }
          if (isExternalLink(href)) {
            return h('span', { class: 'font-sans-serif' }, [
              h(Icon, { name: 'it-external-link', size: 'sm' }),
              h(NuxtLink, { href, title, target: '_blank', rel: 'noopener' }, [children]),
            ]);
          }

          return h(NuxtLink, { href, title, class: 'font-sans-serif' }, [children]);
        },
      },
      {
        element: 'img',
        vNode: (props, children) =>
          h(
            'img',
            {
              src: props.src,
              alt: props.alt,
              width: props.width,
              height: props.height,
              loading: 'lazy',
            },
            [children],
          ),
      },
      {
        element: 'h1',
        vNode: (props, children) => h('h3', { class: 'font-sans-serif' }, [children]),
      },
      {
        element: 'h2',
        vNode: (props, children) => h('h4', { class: 'font-sans-serif' }, [children]),
      },
      {
        element: 'h3',
        vNode: (props, children) => h('h5', { class: 'font-sans-serif' }, [children]),
      },
      {
        element: 'h4',
        vNode: (props, children) => h('h6', { class: 'font-sans-serif' }, [children]),
      },
      {
        element: 'table',
        vNode: (props, children) => h('table', { class: 'table table-responsive' }, [children]),
      },
      {
        element: 'oembed',
        vNode: (props) => {
          const url = props.url as string;
          return h('div', { class: 'embed embed-responsive' }, [
            h('iframe', {
              src: url,
              frameborder: 0,
              allowfullscreen: true,
              loading: 'lazy',
            }),
          ]);
        },
      },
    ];

    const domNodes = parseDocument(html).children;

    return () => h('div', { class: 'rich-text clearfix' }, domToVue(domNodes, nodesToReplace));
  },
};

function domToVue(nodes: any, toReplace: Array<NodeToReplace>): any {
  const result: any = [];

  for (const node of nodes) {
    switch (node.nodeType) {
      case Node.TEXT_NODE:
        handleTextNode(node, result);
        break;
      case Node.ELEMENT_NODE:
        handleElementNode(node, toReplace, result);
        break;
      default:
        // do nothing for other node types
        break;
    }
  }
  return result.length === 1 ? result[0] : result;
}

function handleTextNode(node: Text, result: any) {
  if (!node.nodeValue) return;
  const isWhitespace = !node.nodeValue.trim().length;

  if (!isWhitespace) {
    result.push(node.nodeValue);
  }
}

function handleElementNode(node: Element, toReplace: Array<NodeToReplace>, result: any) {
  const props = attributesToProps(node.attributes);
  const children = node.children.length ? domToVue(node.children, toReplace) : null;

  if (toReplace) {
    const replaceWith = toReplace.find(
      (target) => (!target?.element || target.element === node.tagName) && (!target?.props || target.props === props),
    );
    if (replaceWith) {
      result.push(replaceWith.vNode(props, children));
      return;
    }
  }

  result.push(h(node.tagName, props, children));
}

function attributesToProps(attributes: NamedNodeMap) {
  const _props: Record<string, unknown> = {};
  for (const attribute of attributes) {
    const propName = attribute.name;

    if (propName) {
      const value = attribute.value.length ? attribute.value : true;
      _props[propName] = value;
    }
  }
  return _props;
}
</script>

<style lang="scss" scoped>
figure {
  &.image {
    &-style-side {
      float: right;
      width: 50%;
      margin-left: 1rem;
    }
  }
}

img {
  max-width: 100%;
  min-height: 100%;
  display: blocK;
}

figcaption {
  // .figure-caption
  @include font-size($figure-caption-font-size);
  color: $figure-caption-color;
}

.embed {
  position: relative;
  overflow: hidden;
  padding-top: 90%;

  @include media-breakpoint-up(md) {
    padding-top: 60%;
  }

  @include media-breakpoint-up(lg) {
    padding-top: 50%;
  }

  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
