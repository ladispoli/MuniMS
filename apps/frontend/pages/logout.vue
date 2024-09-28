<script lang="ts" setup>
const { logout } = useStrapiAuth();
const user = useStrapiUser();

const router = useRouter();

try {
  if (!user.value) {
    router.push('/login');
  }
  logout();
  router.push('/');
} catch (e) {
  console.error(e);
}
</script>
