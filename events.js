const defaultComparer = function(item1, item2) {
    if (item1 === item2)
        return true;
    return false;
};

function indexOf(array, value, comparer) {
    if (array === null || array === undefined)
        throw new Error('ArgumentNullException: array must not be null or undefined!');
    if (comparer === undefined)
        comparer = defaultComparer;
    for (let i = 0; i < array.length; i++) {
        let result = comparer(array[i], value);
        if (result) 
            return i;
    }
    return -1;
}

class EventListener {
    constructor(type) {
        this.type = type;
        this.events = [];
    }
    
    add(event) {
        this.events.push(event);
    }

    indexOf(event) {
        return indexOf(this.events, event, this.comparer);
    }

    remove(event) {
        let index = this.indexOf(event);
        if (index > -1) {
            this.events.splice(index);
        }
    }

    invoke(args, sender) {
        for (let i = 0; i < this.events.length; i++) {
            if (this.events[i] !== undefined)
                this.events[i](args, sender);
        }
    }
}

class EventList {
    constructor() {
        this.events = [];
    }

    comparer(item1, item2) {
        if (item1.type === item2)
            return true;
        return false;
    };

    indexOf(type) {
        return indexOf(this.events, type, this.comparer);
    }

    add(type, listener) {
        for (let i; i < this.events.length; i++) {
            if (this.events[i].type === type) {
                this.events[i].add(listener);
                return;
            }
        }
        var eventListener = new EventListener(type);
        eventListener.add(listener);
        this.events.push(eventListener);
    }

    remove(type, listener) {
        let index = this.indexOf(type);
        if (index > -1) {
            this.events[index].remove(listener);
        }
    }

    invoke(type, args, sender) {
        for (let i = 0; i < this.events.length; i++) {
            if (this.events[i].type == type) {
                this.events[i].invoke(args, sender);
                return;
            }
        }
    }
}