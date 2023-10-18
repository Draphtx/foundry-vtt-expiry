Hooks.on("createItem", function(document, _, userId) {
    if(!document.flags?.expiry) {
        console.log("item not configured for expiry")
        return false;
    } else {
        console.log("item configured for expiry")
        const newExpiryObject = new expiryObject(document, _, userId)
        newExpiryObject.createExpiryObject();
    };
    Hooks.off("createItem");
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

class expiryObject {
    constructor(objectDocument, updateData=null, userId=null) {
        this.objectDocument = objectDocument;
        this.updateData = updateData;
        this.userId = userId;
        this.currentTime = SimpleCalendar.api.timestamp()
    };

    createExpiryObject() {
        let parentExpiry = this.objectDocument.flags.expiry;
        this.objectDocument.update({
            flags: {
                expiry: {
                    instance: {
                        createTime: this.currentTime,
                        createName: this.objectDocument.name,
                        activeStage: 0,
                    }
                }
            }
        });
        console.log("created expiry item")
        Hooks.call('createdExpiry', [this.objectDocument, this.userId])
    };

    checkExpiry() {
        if(!this.objectDocument.flags?.expiry?.enabled == true) {
            return false;
        };

        if(this.currentTime >= this.objectDocument.flags.expiry.instance.createTime) {
            this.updateExpiry();
        } else {
            return false;
        };
    };
    
    updateExpiryObject() {
        let expiryData = this.objectDocument.flags.expiry;
        
        // Calculate the time difference in seconds since creation
        const timePassed = this.currentTime - expiryData.instance.createTime;

        // Calculate the number of decay intervals that have passed
        const decaySteps = Math.floor(timePassed / expiryData.decayInterval);

        // Get the array of decay stages from the parentExpiry
        const decayStages = Object.keys(expiryData.decayStages);

        // Determine the current decay stage
        const stageIndex = Math.min(decaySteps, decayStages.length - 1);

        // Update the active stage
        if(!expiryData.instance.activeStage !== stageIndex){
            this.objectDocument.update({
                flags: {
                    expiry: {
                        instance: {
                            activeStage: stageIndex
                        }
                    }
                }
            });
            this._decayExpiryObject(decayStages[stageIndex]);
        };
    };

    _decayExpiryObject(decayStage) {
        // apply decay effects, emit a hook, what have you
        console.log(`decaying item ${this.objectDocument.id}`)
        decayAction = decayStage.action
        if(decayAction.revise){
            this.objectDocument.update({
                img: decayAction.revise.img || this.objectDocument.img,
                name: `${decayAction.revise.prefix}${this.objectDocument.flags.expiry.instance.createName}${decayAction.replace.suffix}` || this.objectDocument.name
            });
        } else if(decayAction.replace){
            const parentActor = objectDocument.parent;
            const replacementItem = game.items.get(decayAction.replace.itemId);
            if(await parentActor.createEmbeddedDocuments('Item', [replacementItem.toObject()])){
                this.objectDocument.delete();
            } else {
                console.error(`unable to create replacement object for Expiry ${this.objectDocument.id}, leaving parent object in-place`);
            }
        } else if(decayStage.action.remove){
            this.objectDocument.delete();
        };

        if(decayStage.message){
            ui.notifications.warn(decayState.message);
        };

    };
};

function getRelevantInventory(actorDocument) {
    const affectedItems = actorDocument.items.filter(item => {
      const expiryFlags = item.flags?.expiry;
      if (!expiryFlags) {
        // If the item doesn't have expiry flags, skip it
        return false;
      }
  
      const currentTime = SimpleCalendar.api.timestamp(); // Get current in-game time
      const instance = expiryFlags.instance;
      const decayStages = expiryFlags.decayStages;
  
      if (!instance || !decayStages) {
        // If either instance or decayStages is missing, skip the item
        return false;
      }
  
      // Calculate the entire lifespan of the item
      const lifespanEnd =
        instance.createTime +
        (Object.keys(decayStages).length * expiryFlags.decayInterval);
  
      // Check if the item's createTime is before or equal to the current time,
      // and if the item is not in its final decay state OR if the entire lifespan
      // is greater than or equal to the current time
      return (
        instance.createTime <= currentTime &&
        (!isInFinalDecayState(instance.activeStage, decayStages) ||
          lifespanEnd >= currentTime)
      );
    });
  
    return affectedItems;
  }
  
  function isInFinalDecayState(activeStage, decayStages) {
    const stages = Object.keys(decayStages);
    return activeStage === stages.length - 1;
  }

function getExpiryActors() {
    // Gets a list of actors who hold expiry-configured items
    return game.actors.filter(actor => actor.items.filter(item => item.flags.expiry));
};

let parentSettings = {
    flags: {
        expiry: {
            decayInterval: 86400,
            decayStages: {
                fresh: {
                    actions: {
                        revise: {
                            rename: {  // What name changes should be made e.g. `Fresh <item name>` or `<item name> (Middling)`
                                suffix: null,
                                prefix: null
                            },
                            reimage: {  // What new item picture should be used
                                newImage: texturePath
                            },
                        },
                        replace: {  // What new item should replace the existing one (invalidates rename/reimage/replace)
                            newItem: itemId
                        },
                        remove: true,  // Remove the item from inventory at this stage? Invalidates all else
                    },
                    message: "Tagwin's fruit rollup rots away"
                }
            }
        }
    }
}