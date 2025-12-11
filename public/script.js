import { sdk } from "https://esm.sh/@farcaster/miniapp-sdk";
import { initQuickQR } from "./QuickQR-ui.js";

window.addEventListener("load", async () => {
  let isMini = false;

  try {
    isMini = await sdk.isInMiniApp();
  } catch (err) {
    console.warn("QuickQR: sdk.isInMiniApp failed, assuming web environment", err);
    isMini = false;
  }

  initQuickQR({ isMini });

  try {
    await sdk.actions.ready();
  } catch (err) {
    console.warn("QuickQR: sdk.actions.ready failed (likely not in mini app)", err);
  }
});
