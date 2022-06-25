<script lang="ts">
  export let content;
  export let mode;

  const jsYaml = window["jsyaml"];
  if(jsYaml == null) {
    throw new Error("jsYaml is undefined");
  }

  let innerHtml = "";
  let frontMatter = {};

  const fmparse = (value)=>{
    let i = 0;
    let inFm = false;
    let lineString = "";
    let lineCnt = 0;
    let fmLinePatern = new RegExp(/^---\s*$/);
    let blankLinePatern = new RegExp(/^\s*$/);
    let fmContent = "";
    let results = {
      fmContent: "",
      body:""
    };
    for(; i < value.length; i++) {
      const s = value[i];
      if(s === "\n") {
        if(inFm) {
          if(fmLinePatern.test(lineString)) {
            results.body = value.slice(i);
            return results;
          } else {
            results.fmContent += lineString + "\n";
          }
        } else {
          if(fmLinePatern.test(lineString)) {
            inFm = true;
          } else if(!blankLinePatern.test(lineString)) {
            results.body = value;
            return results;
          }
        }
        lineString = "";
      } else {
        lineString += s;
      }
      lineCnt++;
      if(lineCnt > 100) {
        results.body = value;
        return results;
      }
    }
    results.body = value;
    return results;
  };


  const parse = (function () {
    var interval = 600;
    var time = Date.now(),
      lag,
      debounceTimer,
      debounceDelay = 16;

    return function (content) {
      lag = time + interval - Date.now();
      if (lag < 0) {
        time = Date.now();
        const results = fmparse(content);
        try {
          frontMatter = jsyaml.load(results.fmContent);
        } catch(e) {
          frontMatter = {error: e};
        }
        console.log(frontMatter);
        innerHtml = marked.parse(results.body);
      } else {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(function () {
          const results = fmparse(content);
          try {
            frontMatter = jsyaml.load(results.fmContent);
          } catch(e) {
            frontMatter = {error: e};
          }
          console.log(frontMatter);
          innerHtml = marked.parse(results.body);
        }, interval - lag + debounceDelay);
      }
    };
  })();


  content.subscribe((value)=>{
    parse(value || "");
  });
</script>

<div class="marked-wrapper">
  <div id="marked" class="markdown {mode === 'viewer' ? 'content-center' : ''}">
    {@html innerHtml}
  </div>
</div>

<style lang="scss">
.marked-wrapper {
  width: 100%;
  height: 100%;
  overflow: scroll;
  overflow-wrap: break-word;
}

.content-center {
  width: 50%;
  margin: auto;
}
</style>


