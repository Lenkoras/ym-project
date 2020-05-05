class WebLoader {
    constructor(prefix) {
        if (prefix !== undefined)
            this.prefix = prefix;
        else
            this.prefix = "";
        this.eventList = new EventList()
        this.src = "";
    }

    removeEvent(type, listener) {
        this.eventList.remove(type, listener);
    }

    addEvent(type, listener) {
        this.eventList.add(type, listener);
    }

    download(src, onevent) {
        if (src === undefined)
            src = this.src;
        var path = this.prefix + src;
        let request = new XMLHttpRequest();
        const sender = this;
        request.onload = function() {
            sender.eventList.invoke(onevent, request, sender);
        };
        request.open('GET', path);
        request.send();
    }
}

class Container {
    constructor(selector) {
        this.selector = selector;
        this.onAdd = null;
    }

    init() {
        if (this.selector === undefined)
            return;
        this.value = document.querySelector(this.selector);
    }

    addHandle(value) {
        return value;
    }

    add(src, args) {
        let img = document.createElement('img');
        img.setAttribute('src', src);
        img.setAttribute('alt', "art");
        let item = this.buildItem();
        if (this.onAdd !== null || this.onAdd !== undefined) {
            this.onAdd(item, img, args);
        }
    }
    
    addAll(pages) {
        const sender = this;
        pages.forEach(function(page) {
            sender.add(sender.addHandle(page), page);
        });
    }

    loadContent() {}
}

class RequestBuilder {
    chapter(id) {
        return "titles/chapters/" + id;
    }

    lastChapters(page, count) {
        return ["titles/last-chapters/?page=", page, "&count=", count].join("");
    }

    search(query, page, count) {
        if (query === undefined || query === null || query === "")
            return;
        if (count === undefined || count < 1)
            count = 30;
        if (page === undefined || page < 1)
            page = 1;
        query = query.replace(' ', '%20');
        return ["search/?query=", query, "&count=", count, "&page=", page].join("");
    }

    titles(page, count) {
        return ["search/catalog/?ordering=rating&page=", page, "&count=", count].join("");
    }

    genres() {
        return "forms/titles/?get=genres";
    }

    random() {
        return "search/catalog/?ordering=random&count=1";
    }
}

const toJSON = function(request) {
        if (request.response !== undefined)
        {
            let response = null;
            try {
                response = JSON.parse(request.response);
            }
            catch (ex) {
                console.error(ex);
                return null;
            }
            return response;
        }
        return null;
    };

class ApiHandler {
    constructor() {
        this.eventList = new EventList();
        this.loader = new WebLoader("/api/");
        this.builder = new RequestBuilder();
    }

    on(type, listener) {
        this.eventList.add("on" + type, listener);
    }

    load(src, onevent, handler) {
        let onload = null;
        const sender = this;
        onload = function(request) {
            sender.loader.removeEvent(onevent, onload);
            sender.eventList.invoke(onevent, handler(request), sender);
        };
        this.loader.addEvent(onevent, onload);
        this.loader.download(src, onevent);
    }

    getChapter(src) {
        this.load(this.builder.chapter(src), 'ongetchapter', toJSON);
    }

    getLastChapters(page, count) {
        return null;
    }

    getTitles(page, count) {
        this.load(this.builder.titles(page, count), 'ongettitles', toJSON);
    }

    getGenres() {
        return null;
    }

    search(query, page, count) {
        return null;
    }

    getRandom() {
        this.load(this.builder.random(), 'ongetrandom', toJSON);
    }
}

EventListener.prototype.toString = function() {
    return [this.type, this.events.join("\n")].join("\n");
  }