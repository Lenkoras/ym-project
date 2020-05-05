class Catalog extends Container {

    constructor(selector) {
        super(selector);
        this.addHandle = function(value) {
            return value.img.high;
        }
        this.onAdd = function(item, img, args) {
            item[0].appendChild(img);
            item[0].parentNode.parentNode.href = "title/" + args.dir;
            item[1].textContent = args.rus_name
        }
    }

    buildItem() {
        let item = document.createElement('a');
        let itemContainer = document.createElement('figure');
        let contentPrw = document.createElement('div');
        let contentName = document.createElement('div');
        this.value.appendChild(item);
        item.appendChild(itemContainer);
        itemContainer.appendChild(contentPrw);
        itemContainer.appendChild(contentName);
        item.classList.add('link');
        item.classList.add('item');
        itemContainer.classList.add('item-container');
        itemContainer.classList.add('button');
        contentPrw.classList.add('content-prw');
        contentName.classList.add('content-name');
        return [contentPrw, contentName];
    }

    loadContent = function(builder) {
        let sender = this;
        let api = builder.api;
        api.on('gettitles', function(request) {
            if (request !== null) {
                sender.addAll(request.content);
                let items = builder.bindOnClick('.item');
                builder.visual.waveTo(items);
                api.eventList.clear();
            }
            else 
                console.error("loading error");
        });
        api.getTitles(1, 30);
    }
}

class ImageContainer extends Container {

    constructor(selector) {
        super(selector);
        this.addHandle = function(value) {
            return value.link;
        }
        this.onAdd = function(item, img) {
            item.appendChild(img);
        }
    }

    buildItem() {
        let item = document.createElement('div');
        this.value.appendChild(item);
        item.classList.add('img-item');
        return item;
    }

    loadContent = function(builder) {
        let sender = this;
        let api = builder.api;
        api.on('getchapter', function(request) {
            if (request !== null) {
                sender.addAll(request.content.pages);
                api.eventList.clear();
            }
            else 
                console.error("loading error");
        });
        api.getChapter("120200");
    }
}

class Page extends Container 
{
    constructor() { 
        super();
    }
}