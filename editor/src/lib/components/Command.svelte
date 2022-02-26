<script lang="ts">
  import { onMount } from 'svelte';
  import { createEventDispatcher } from 'svelte';
  import { runCommand, CommandResults } from "./Command.ts"

  export let baseUrl = "";
  export let recentlyModifiedFiles = [];
  export let commandResults: CommandResults;

  const dispatch = createEventDispatcher();

  let commandInputElem
  let commandValue;

  function handleKeydown(event) {
    if(event.key === "Enter" && commandInputElem.value.length > 0) {
      if(!commandValue) {
        return;
      }
      commandInputElem.disabled = true;
      runCommand(commandValue);
    }
  }

  export const focus = ()=>{
    setTimeout(()=>{commandInputElem.focus()}, 1);
  };

  export const clear = ()=>{
    commandValue = "";
  };

  export const enable = ()=>{
    commandInputElem.disabled = false;
  };

  onMount(()=>{
    document.addEventListener("keydown", handleKeydown, false);
  });

</script>

<div id="command" class="markdown">
  <div>
    <h2>
      <input type="text" class="command-input" bind:value={commandValue} bind:this={commandInputElem}/>
    </h2>
  </div>

  <div>
    {#if commandResults != null}
      <div id="command-results">
        {console.log(commandResults) || ""}
        {#if commandResults.results.length > 0}
          <h3>{commandResults.message}</h3>
          {#each commandResults.results as res}
            {@html res.html()}
          {/each}
        {/if}
      </div>
    {/if}
  </div>
  <div>
    <h2>Recently Modified Files</h2>
    <div>
      {#each recentlyModifiedFiles as file}
        <p><a class="filename" href="{baseUrl + '?id=' + file.id}" target="_blank">{file.name}</a> <span>(LastModified: {new Date(file.lastModified).toLocaleString()})</span></p>
      {/each}
    </div>
  </div>
</div>

<style lang="scss">
#command {
  width: 100%;
  height: 100%;
}

input[type="text"]:focus {
  outline: none;
}

input[type="text"] {
  width: 86%;
  font-size: 32px;
  border-top: none;
  border-left: none;
  border-right: none;
  border-bottom: 1px solid gray;
  font-weight: bold;
  color: #3f3f3f;
}

.command-button {
  font-size: 18px;
  text-decoration: underline;
  cursor: pointer;
}

.filename {
  font-weight: bold;
  font-size:16px;
}

i {
  padding: 5px;
}
</style>
