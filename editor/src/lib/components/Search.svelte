<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let baseUrl = "";
  export let recentlyModifiedFiles = [];
  export let searchResults = [];

  let searchValue;

  const dispatch = createEventDispatcher();
</script>

<div id="search" class="markdown">
  <div>
    <h2>Search</h2>
    <div>
      <input type="text" class="search-input" bind:value={searchValue}/>
      <div> <span class="search-button" on:click={dispatch('search', searchValue)}>search!<span> </div>
    </div>
    <div id="search-results">
      <h3>Results</h3>
      {#each searchResults as file}
        <p><a class="filename" href="{baseUrl + '?id=' + file.id}" target="_blank">{file.name}</a> <span>(LastModified: {new Date(file.lastModified).toLocaleString()}, Parents: {file.parents})</span></p>
      {/each}
    </div>
  </div>
  <div>
    <h2><a href="{baseUrl + '?page=create'}" target="_blank">Create New File</a></h2>
  </div>
  <div>
    <h2>Recently Modified Files</h2>
    <div>
      {#each recentlyModifiedFiles as file}
        <p><a class="filename" href="{baseUrl + '?id=' + file.id}" target="_blank">{file.name}</a> <span>(LastModified: {new Date(file.lastModified).toLocaleString()}, Parents: {file.parents})</span></p>
      {/each}
    </div>
  </div>
</div>

<style lang="scss">
#search {
  width: 100%;
  height: 100%;
}

input[type="text"]:focus {
  outline: none;
}

input[type="text"] {
  width: 60%;
  font-size: 22px;
  border-top: none;
  border-left: none;
  border-right: none;
  border-bottom: 1px solid gray;
}

.search-button {
  font-size: 18px;
  text-decoration: underline;
  cursor: pointer;
}

.filename {
  font-weight: bold;
  font-size:16px;
}
</style>
