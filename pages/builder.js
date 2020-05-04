class PageBuilder {
    constructor(header, content) {
        this.header = this.search(header);
        this.content = this.search(content);
        this.eventList = new EventList();
    }

    search(selector) {
        return document.querySelector(selector);
    };

    on(value, type, listener) {
        let event = function(e) {
            listener(e);
            e.preventDefault();
        };
        value.addEventListener(type, event);
    }

    onclick(value, listener) {
        this.on(value, 'click', listener);
    }

    link(listener, href) {
        let value = document.createElement('a');
        value.classList.add('link');
        value.href = href;
        this.click(value, listener);
        return value;
    }

    remove(value) {
        value.removeChild(value.children[0]);
    }

    moveTo(src) {
        if (src == document.location.href)
            return;
        src = src.split('/');
        let path = "/";
        for (let i = 3; i < src.length; i++) {
            path += src[i];
        }
        history.pushState(null, null, path);
        this.remove(this.content);
        let sender = this;

        this.addEventListener(path, function(request) {
            sender.content.innerHTML = request.responseText;
        });
        this.download(path);
    }

    addEventListener(type, listener) {
        this.eventList.add(type, listener);
    }

    download(src) {
        let request = new XMLHttpRequest();
        const sender = this;
        request.onload = function() {
            sender.eventList.invoke(src, request, sender);
        };
        request.open('GET', src);
        request.send();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    let buttons = document.querySelectorAll('.button');
    let builder = new PageBuilder('#header', '.content');
    for (let i = 0; i < buttons.length; i++) {
        builder.onclick(buttons[i], function(event) {
            builder.moveTo(buttons[i].href);
        });   
    }
});