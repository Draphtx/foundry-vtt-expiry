export class expiryObject {
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
                        activeStage: 0,
                    }
                }
            }
        });
        console.log("created expiry item")
        Hooks.call('createdExpiry', [this.objectDocument, this.userId])
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
            // _decayExpiryObject();
            this.objectDocument.update({
                flags: {
                    expiry: {
                        instance: {
                            activeStage: stageIndex
                        }
                    }
                }
            });
        };
    };

    _decayExpiryObject() {
        // apply decay effects, emit a hook, what have you
        console.log(`decaying item ${this.objectDocument.id}`)
    };
};

function getRelevantInventory(actorDocument) {
    const affectedItems = actorDocument.items.filter(item => {
      const expiryFlags = item.flags?.expiry;
      if (!expiryFlags) {
        // If the item doesn't have expiry flags, skip it
        return false;
      }
  
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
        instance.createTime <= this.currentTime &&
        (!isInFinalDecayState(instance.activeStage, decayStages) ||
          lifespanEnd >= this.currentTime)
      );
    });
    return affectedItems;
};
  
  function isInFinalDecayState(activeStage, decayStages) {
    const stages = Object.keys(decayStages);
    return activeStage === stages.length - 1;
};

export function getExpiryActors() {
    // Gets a list of actors who hold expiry-configured items
    return game.actors.filter(actor => actor.items.filter(item => item.flags.expiry));
};