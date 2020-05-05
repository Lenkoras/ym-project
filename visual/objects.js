class GarbageCollector {

    removeAfter(item, time) {
        setTimeout(function () {
        item.remove();
        }, time);
    };
}

class ButtonConstructor {
    
    constructor() {
    }

    clickEvent(event) {
        var item = document.createElement('div');
        var style = item.style, 
        maxValue = Math.max(event.target.clientWidth, event.target.clientHeight),
        rectangle = event.target.getBoundingClientRect();
        style.width = style.height = maxValue + 'px';
        style.left = event.clientX - rectangle.left - maxValue / 2 + 'px';
        style.top = event.clientY - rectangle.top - maxValue / 2 + 'px';
        item.classList.add('wave');
        event.target.append(item);
        
        item.addEventListener('mousedown', this.clickEvent);   
        window.GC.removeAfter(item, 700);
    }

    handle = function(item) {
        item.addEventListener('mousedown', this.clickEvent);
    }
}

class Visual {
    constructor() {
        this.bc = new ButtonConstructor(); 
    }

    get(className) {
        return document.getElementsByClassName(className);
    }

    waveTo(items) {
        for (var i = 0; i < items.length; i++) {
            this.bc.handle(items[i]);
        }
        return items;
    }
    
    wave(name) {
        return this.waveTo(this.get(name));
    }
}
window.GC = new GarbageCollector();