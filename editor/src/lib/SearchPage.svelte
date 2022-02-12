<script lang="ts">
  import Search from "./components/Search.svelte";

  import { onMount } from 'svelte';
  import { getRecentlyModifiedFiles, searchFiles } from "./components/Rpc.ts";

  export let config;

  let recentlyModifiedFiles = [];
  let searchResults = [];

  function handleSearch(e) {
    const searchValue = e.detail;
    searchFiles(searchValue).then((files)=>{
      searchResults = files;
    });
  }

  onMount(async ()=>{
    recentlyModifiedFiles = await getRecentlyModifiedFiles();
  })
</script>

<div id="search-wrapper" class="content-center">
  <Search
    recentlyModifiedFiles={recentlyModifiedFiles}
    searchResults={searchResults}
    baseUrl={config.baseUrl}
    on:search={handleSearch}
  />
</div>

<style lang="scss">
</style>
