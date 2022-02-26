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
  --width: 40%;
  --height: 30%;
  min-height: 250px;
  z-index: 1000;
  position: absolute;
  margin: 0 auto;
  overflow: scroll;
  width: var(--width);
  height: var(--height);
  top: 100px;
  left: calc(50% - var(--width) / 2);
  align-items: center;
  padding: 10px 30px;
  border: solid 1px #eee;
  background-color: white;
  text-align: left;
  font-weight: 700;
  font-family: 'Noto Sans Mono';
  overflow-wrap: anywhere;
  box-shadow: 4px 4px 7px -5px #444;
}

.modal-hidden {
  visibility: hidden;
}
</style>
