class expiryObject {
    constructor(document, _, userId) {
        this.objectDocument = document;
        this.currentTime = SimpleCalendar.api.timestamp()
        this.userId = userId;
    };

    createExpiry() {
        if(!this.objectDocument.flags?.expiry?.enabled == true) {
            return false;
        };

        // let parentExpiry = this.objectDocument.flags.expiry.item;
        let parentExpiry = {
            decayStages: {
                Fresh: {},
                Rotten: {},
            },
            decayInterval: 21600,
        }
        this.objectDocument.update({
            flags: {
                expiry: {
                    parent: {
                        decayInterval: parentExpiry.decayInterval,
                        decayStages: parentExpiry.decayStages,
                    },
                    instance: {
                        createTime: this.currentTime,
                        activeStage: 0,
                    }
                }
            }
        });
        Hooks.call('expirySet', [this.objectDocument, this.userId])
    };

    checkExpiry() {
        if(!this.objectDocument.flags?.expiry?.enabled == true) {
            return false;
        };

        if(this.currentTime >= this.objectDocument.flags.expiry.instance.createTime + decayInterval) {
            this.updateExpiry();
        } else {
            return false;
        };
    };
    
    _updateExpiry() {
        let expiryData = this.objectDocument.flags.expiry;
        
        // Calculate the time difference in seconds since creation
        const timePassed = currentTime - expiryData.instance.createTime;

        // Calculate the number of decay intervals that have passed
        const decaySteps = Math.floor(timePassed / expiryData.parent.decayInterval);

        // Get the array of decay stages from the parentExpiry
        const decayStages = Object.keys(expiryData.parent.decayStages);

        // Determine the current decay stage
        const stageIndex = Math.min(decaySteps, decayStages.length - 1);

        // Update the active stage
        if(!expiryData.instance.activeStage == stageIndex){
            _decayObject();
            this.objectDocument.update({
                flags: {
                    expiry: {
                        instance: {
                            activeStage: stageIndex
                        }
                    }
                }
            });
        }
    };

    _decayObject() {
        // apply decay effects, emit a hook
    };
    
    

};