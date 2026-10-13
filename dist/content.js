"use strict";
/**
 * Personal diagnostic hook. Logs matching Flow requests and reports them
 * to the extension popup. Responses are returned unchanged.
 */
(() => {
    const FLAG = "__futureforge_flow_enabled";
    const originalFetch = window.fetch;
    window.fetch = async function (...args) {
        const response = await originalFetch.apply(this, args);
        try {
            const requestUrl = typeof args[0] === "string"
                ? args[0]
                : args[0] instanceof Request ? args[0].url : String(args[0]);
            const enabled = localStorage.getItem(FLAG) === "true";
            if (enabled && location.hostname === "flow.google.com" &&
                /config|bootstrap|feature|setting/i.test(requestUrl)) {
                const contentType = response.headers.get("content-type") || "";
                console.info("[FutureForge Ai By Passer]", requestUrl, "status=", response.status, "content-type=", contentType);
                window.postMessage({
                    source: "futureforge-flow",
                    type: "hit",
                    url: requestUrl,
                    status: response.status,
                    contentType,
                    at: Date.now()
                }, location.origin);
            }
        }
        catch (error) {
            console.debug("[FutureForge Ai By Passer] diagnostic hook error", error);
        }
        return response;
    };
})();
