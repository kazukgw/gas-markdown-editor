<script lang="ts">
  import { onMount } from 'svelte';

  export let content: string;

  let modalElem;
  function handleClick(event) {
    if(!modalElem.contains(event.target)) {
      content = "";
    }
  }
  onMount(()=>{
    modalElem = document.querySelector("#modal");
    document.addEventListener("click", handleClick, true);
  });
</script>

<div id="modal" class="{!!content ? '' : 'modal-hidden'}">
  {@html content}
</div>

<style lang="scss">
#modal {
  --width: 50%;
  --height: 30%;
  z-index: 1000;
  position: absolute;
  margin: 0 auto;
  overflow: scroll;
  width: var(--width);
  height: var(--height);
  top: 100px;
  left: calc(50% - var(--width) / 2);
  align-items: center;
  padding: 8px;
  border-radius: 4px;
  border: solid gray 1px;
  background-color: white;
  text-align: center;
  font-weight: bold;
}

.modal-hidden {
  visibility: hidden;
}
</style>
