 <template>
  <div>
    <Navbar />
    <Alert></Alert>
    <div class="container-fluid">
      <div class="row">
        <Sidebar />
        <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-4">
          <a href="#" @click.prevent="logout">登出</a>
          <router-view />
        </main>
      </div>
    </div>
  </div>
</template>

 <script>
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Alert from "./AlertMessage";

export default {
  components: {
    Navbar,
    Sidebar,
    Alert
  },
  methods: {
    logout() {
      const vm = this;
      const api = `${process.env.API_PATH}/logout`;
      this.$http.post(api).then(response => {
        console.log(response.data);
        if (response.data.success) {
          vm.$router.push("/login");
        }
      });
    }
  }
};
</script>
 