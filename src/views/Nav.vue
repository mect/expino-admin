<template id="nav">
  <div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <a class="navbar-brand" href="#">Expino</a>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li :class="$route.name == 'home' ? 'nav-item active' : 'nav-item'">
            <router-link class="nav-link" to="/home"
              ><i class="fas fa-home"></i> Home</router-link
            >
          </li>
          <li
            :class="
              $route.name.indexOf('news') == 0 ? 'nav-item active' : 'nav-item'
            "
          >
            <router-link class="nav-link" to="/news"
              ><i class="fas fa-newspaper"></i> News</router-link
            >
          </li>
        </ul>
      </div>
    </nav>

    <!-- Nested route -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {};
</script>
