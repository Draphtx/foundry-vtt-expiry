import { expiryObject, getExpiryActors, getRelevantInventory } from './expiry.js';

Hooks.on("createItem", function(document, _, userId) {
    if(!document.flags?.expiry) {
        return false;
    } else {
        const newExpiryObject = new expiryObject(document, _, userId)
        newExpiryObject.createExpiryObject();
    };
});

Hooks.on("simple-calendar-date-time-change", function(data) {
    const expiryActors = getExpiryActors()
    for(const expiryActor of expiryActors) {
        const affectedItems = getRelevantInventory(expiryActor);
        for(const affectedItem of affectedItems) {
            console.log("updating expiry item")
            const newExpiryObject = new expiryObject(affectedItem, data);
            newExpiryObject.updateExpiryObject();
        };
    };
    Hooks.off("simple-calendar-date-time-change");
});