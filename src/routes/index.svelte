<script>
  import { fade, fly } from "svelte/transition";
  import { backOut } from "svelte/easing";
  import confetti from "canvas-confetti";
  import { onMount } from "svelte";

  let value = "";
  let bingo = [];
  let bingo_animation = false;
  let timeout = null;

  let CV = null;
  let CONFETTI = null;

  onMount(() => {
    CV = document.getElementById("its-a-match-canvas");
    CONFETTI = confetti.create(CV, { resize: true });
  });

  // Fisher-Yates shuffle
  function shuffle(array) {
    let curr = array.length;
    let rand;

    while (curr) {
      rand = Math.floor(Math.random() * curr);
      curr--;
      [array[curr], array[rand]] = [array[rand], array[curr]];
    }

    return array;
  }

  function generate() {
    if (
      bingo.some((b) => b.checked) &&
      !window.confirm("Are you sure you want start over?")
    )
      return;

    const ENTRIES = value.split("\n").filter((e) => e.trim().length);

    bingo = shuffle(ENTRIES).map((item) => {
      return {
        text: item,
        checked: false,
      };
    });
  }

  function reset() {
    if (
      bingo.some((b) => b.checked) &&
      window.confirm("Are you sure you want to reset?")
    )
      bingo.forEach((_, i) => {
        bingo[i].checked = false;
      });
  }

  function ayyy() {
    try {
      clearTimeout(timeout);

      bingo_animation = true;

      CONFETTI({ particleCount: 250, spread: 75, origin: { y: 0.7 } });

      timeout = setTimeout(() => (bingo_animation = false), 1750);
    } catch (e) {
      console.error("no confetti for you :(", e);
    }
  }

  function select(i) {
    bingo[i].checked = !bingo[i].checked;

    const HOR_WIN = [0, 5, 10, 15, 20].some((I) =>
      bingo.slice(I, I + 5).every((boi) => boi.checked)
    );
    const VER_WIN = [0, 1, 2, 3, 4].some((I) =>
      bingo.filter((_, J) => J % 5 === I).every((boi) => boi.checked)
    );
    const DIAG_WIN = [0, 6, 12, 18, 24].every((I) => bingo[I].checked);
    const DIAG_WIN2 = [4, 8, 12, 16, 20].every((I) => bingo[I].checked);

    if (HOR_WIN || VER_WIN || DIAG_WIN || DIAG_WIN2) ayyy();
  }
</script>

<main
  class="bg-dark-200 text-light-50 min-h-screen flex flex-col py-4 justify-start items-center gap-5 env-padding"
>
  <div
    class="fixed h-screen top-0 z-10 pointer-events-none bg-transparent transition-all flex items-center justify-center"
  >
    <canvas id="its-a-match-canvas" class="absolute z-10 top-0 h-screen" />
    {#if bingo_animation}
      <span
        in:fly={{ y: 50, duration: 400, easing: backOut }}
        out:fade={{ duration: 750 }}
        class="block z-20 font-bold text-5xl select-none text-shadow-xl"
      >
        Bingo!
      </span>
    {/if}
  </div>
  <h1 class="text-2xl font-bold">Incredibly primitive Bingo-generator</h1>
  <section
    class="w-full max-w-prose bg-dark-50 shadow-lg rounded-lg overflow-hidden"
  >
    <textarea
      class="w-full min-h-32 max-h-screen-lg bg-transparent border-b border-b-light-900 px-4 py-3 rounded-t-lg focus:outline-none whitespace-nowrap leading-tight"
      placeholder="Each line represents an item. You can use any characters you want."
      rows="10"
      bind:value
    />
    <div class="flex items-center justify-between p-3 gap-3">
      <button
        class="flex-1 appearance-none py-1 px-2 text-lg font-semibold bg-true-gray-100 text-black rounded-lg shadow-md border border-2 border-true-gray-100 focus:outline-none"
        on:click={generate}
      >
        Generate
      </button>
      <button
        class="appearance-none py-1 px-3 text-lg font-semibold border border-2 rounded-lg shadow-md border-true-gray-100 focus:outline-none"
        on:click={reset}
      >
        Reset checked
      </button>
    </div>
  </section>
  {#if bingo?.length}
    <section class="max-w-screen w-full overflow-x-auto">
      <div class="grid grid-cols-5 grid-rows-5 gap-2 min-w-screen-md">
        {#each bingo?.slice(0, 25) || [] as BONGO, I}
          {@const CHECKED = BONGO.checked}
          <div
            class="bg-true-gray-700 rounded-md p-2 text-center flex items-center justify-center transition-all border border-true-gray-600 text-sm cursor-pointer active:(transition-none bg-true-gray-600) select-none"
            class:bg-true-gray-500={CHECKED}
            class:border-true-gray-400={CHECKED}
            class:shadow-md={CHECKED}
            on:click={() => {
              select(I);
            }}
          >
            {BONGO.text}
          </div>
        {/each}
      </div>
    </section>
  {/if}
</main>

<style windi:preflights:global windi:safelist:global>
  .env-padding {
    padding-left: max(12px, env(safe-area-inset-left));
    padding-right: max(12px, env(safe-area-inset-right));
  }
</style>
