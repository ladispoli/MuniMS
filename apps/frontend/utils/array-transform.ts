/**
 * sort an array of objects by objects' properties (two at most)
 */
function sortBy(arr?: Array<Record<string, any>>, props?: string | [string, string], order: 'asc' | 'desc' = 'desc') {
  if (!arr?.length) return [];
  if (!props) return arr;

  const [prop1, prop2 = ''] = Array.isArray(props) ? props : [props];
  const direction = order === 'desc' ? 1 : -1;

  return arr.sort((a, b) => {
    if (a[prop1] > b[prop1] || (prop2 && a[prop1] === b[prop1] && a[prop2] > b[prop2])) {
      return direction;
    }
    return -direction;
  });
}

export { sortBy };
