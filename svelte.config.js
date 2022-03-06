import adapter from "@sveltejs/adapter-static";
import { windi } from "svelte-windicss-preprocess";

const DEV = process.env.NODE_ENV === "development";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: [
    windi({})
  ],
  kit: {
    adapter: adapter(),
    paths: {
      base: DEV ? "" : "/sveltekit-windi-scaffold",
    },
  },
};

export default config;
