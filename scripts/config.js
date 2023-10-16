Hooks.once("init", function () {

    game.settings.register("expiry", "expiry-active", {
        name: "Expiry Active",
        hint: "Enable food spoilage with Expiry. While disabled, the age of Expiry items is paused.",
        scope: "world",
        config: true,
        default: true,
        type: Boolean
    });

});
