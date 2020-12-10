const svg = (function() {

    const getSvgPos = (item, scale) => {
        let svgRect = item.getBoundingClientRect();
        let viewBox = item.getAttribute('viewBox');
        let vb = viewBox.split(' ').map(i => Number(i) * scale);

        let vbox = {
            x: vb[0] < 0 ? 0 : vb[0],
            y: vb[1] < 0 ? 0 : vb[1],
            width: vb[2],
            height: vb[3]
        }
        let left = (svgRect.width - vbox.width) / 2; // korekta przesunięcia svg
        if (left < 0) left = 0;
        let top = (svgRect.height - vbox.height) / 2;
        if (top < 0) top = 0;

        // let cx = (vb[0] + (vb[2] / 2)) / scale;
        // let cy = (vb[1] + (vb[3] / 2)) / scale;
        // console.log('%c center:', 'background: #ffcc00; color: #003300', cx, cy)

        return {
            x: svgRect.left + left,
            y: svgRect.top + top
        }
    }

    const getSVGelem = type => document.createElementNS('http://www.w3.org/2000/svg', type);

    const getSVGg = (id = false, cla = false, trans = false, click = false) => {
        let g = getSVGelem('g');
        if (id) g.setAttribute('id', id);
        if (cla) g.setAttribute('class', cla);
        if (trans) g.setAttribute('transform', trans);
        if (click) g.setAttribute('onclick', click);
        return g;
    }

    const getSVGsvg = (id = false, cla = false, vbox = false) => {
        let svg = getSVGelem('svg');
        if (id) svg.setAttribute('id', id);
        if (cla) svg.setAttribute('class', cla);
        if (vbox) svg.setAttribute('viewBox', vbox);
        return svg;
    }

    const getSVGpolygon = (cla = false, points = false) => {
        let polygon = getSVGelem('polygon');
        if (cla) polygon.setAttribute('class', cla);
        if (points) polygon.setAttribute('points', points);
        return polygon;
    }

    // dom.svg.get.path()
    const getSVGpath = (id = false, cla = false, d = false) => {
        let path = getSVGelem('path');
        if (id) path.setAttribute('id', id);
        if (cla) path.setAttribute('class', cla);
        if (d) path.setAttribute('d', d);
        return path;
    }

    const getSVGcyrcle = (r, cx = '0', cy = '0', cla = false) => {
        let circle = getSVGelem('circle');
        circle.setAttribute('r', r);
        circle.setAttribute('cx', cx);
        circle.setAttribute('cy', cy);
        if (cla) circle.setAttribute('class', cla);
        return circle;
    }

    const getSVGtext = (cla = false, x = 0, y = 1) => {
        let text = getSVGelem('text');
        if (cla) text.setAttribute('class', cla);
        text.setAttribute('x', x);
        text.setAttribute('y', y);
        return text;
    }

    const getSVGtspan = (cla = false) => {
        let tspan = getSVGelem('tspan');
        if (cla) tspan.setAttribute('class', cla);
        return tspan;
    }

    const getSVGtextPath = (href, startOffset = '50%') => {
        let textPath = getSVGelem('textPath');
        textPath.setAttribute('href', href);
        if (startOffset) textPath.setAttribute('startOffset', startOffset);
        return textPath;
    }

    const svgToData = (item, attributeExceptions = [], classExceptions = []) => {

        if (classExceptions.some(e => item.classList.contains(e))) return false;

        let data = {
            t: item.nodeName
        };

        for (let attribute of item.attributes) {
            if (attributeExceptions.some(e => e == attribute.name)) continue;
            if (typeof data.a == 'undefined') data.a = {};
            data.a[attribute.name] = attribute.value;
        }

        if (item.children.length > 0) {
            data.c = []
            for (let child of item.children) {
                let dataFromChild = svgToData(child, attributeExceptions, classExceptions);
                if (dataFromChild) data.c.push(dataFromChild)
            }
        }

        return data;
    }

    const dataToSvg = (data, attributeExceptions = [], classExceptions = []) => {
        let itemClass = data.a ? Object.keys(data.a).find(e => e == 'class') : null;
        if (itemClass && classExceptions.some(e => data.a.class.indexOf(e) > -1)) return null;

        let elem = getSVGelem(data.t);

        if (typeof data.a != 'undefined') {
            for (let key in data.a) {
                if (attributeExceptions.some(e => e == key)) continue;
                elem.setAttribute(key, data.a[key]);
            }
        }

        if (typeof data.c != 'undefined') {
            for (let c of data.c) {
                let child = dataToSvg(c, attributeExceptions, classExceptions);
                if (child) elem.append(child);
            }
        }

        return elem;
    }

    const clone = (item, attributes) => {
        let newItem = getSVGelem(item.nodeName);
        for (let attr of attributes) {
            let value = item.getAttribute(attr);
            newItem.setAttribute(attr, value);
        }
        return newItem;
    }

    return {
        g: getSVGg,
        svg: getSVGsvg,
        polygon: getSVGpolygon,
        path: getSVGpath,
        circle: getSVGcyrcle,
        text: getSVGtext,
        tspan: getSVGtspan,
        textp: getSVGtextPath,

        pos: getSvgPos,
        elem: getSVGelem,

        toData: svgToData,
        fromData: dataToSvg,
        clone: clone
    }
}())

let attributeList = [
    { col: '3399ff', d: 'M 2.1802721,16.065469 2.9350762,16.910845 9.9245259,9.0760138 16.913974,17.092001 17.819728,16.125855 10.332114,3.0225153 9.4867395,2.9923773 Z' },
    { col: '009933', d: 'M 4.9402955,9.9839098 10.29889,4.7961039 15.059704,10.026604 9.9573025,15.086313 Z' },
    { col: 'ff33cc', d: 'm 2.1820849,4.7832809 c -0.04174,0.3667098 -0.02493,1.0907678 -0.02609,1.4605326 1.97e-4,4.9075145 3.599407,8.8853475 7.8801301,8.8840035 4.279244,-10e-4 7.808222,-3.985722 7.808414,-8.8915509 -0.0039,-0.369956 0.01739,-1.0638174 -0.02609,-1.430336 l -1.24185,-0.015069 C 16.106143,8.5779071 13.249451,11.74117 9.9016979,11.746353 6.5521599,11.743453 3.7360369,8.5797852 3.2653489,4.7911217 Z' },
    { col: '33cccc', d: 'M 10.001876,3.9228007 A 6.2476915,6.0683712 0 0 0 3.7521415,9.9913938 6.2476915,6.0683712 0 0 0 10.001876,16.06 6.2476915,6.0683712 0 0 0 16.247859,9.9913938 6.2476915,6.0683712 0 0 0 10.001876,3.9228007 Z m 0.09425,2.1511819 a 3.7513565,3.9702484 0 0 1 3.751384,3.9702504 3.7513565,3.9702484 0 0 1 -3.75136,3.97025 3.7513565,3.9702484 0 0 1 -3.7513445,-3.97025 3.7513565,3.9702484 0 0 1 3.7513445,-3.9702504 z' },
    { col: 'ff3300', d: 'm 10.75222,2.2501783 c -2.1828564,1.697433 -3.8648284,3.6789284 -5.6356554,5.7877294 -1.770836,2.1088013 -2.40262,5.4287643 0.04523,7.8639183 2.446619,2.43448 5.5734304,2.121032 7.5989604,0.599953 2.025523,-1.521086 3.477079,-3.875171 3.689639,-4.084165 l -0.69972,-0.714099 C 12.680198,14.740261 9.6214746,14.525082 8.3937676,13.313178 7.1660646,12.10128 5.5031576,8.7440708 12.263537,2.7103048 L 11.77488,2.2027314 Z' },
    { col: 'ccff33', d: 'm 6.316575,6.1418114 h 7.36685 v 7.7291636 h -7.36685 z' },
    { col: '009900', d: 'm 2.180265,3.7105423 0.75481,-0.8453739 6.98946,7.8348236 6.98945,-8.0159762 0.90575,0.9661461 -7.48761,13.1033291 -0.84539,0.03014 z' }
]

const getSvg = num => {
    let d = attributeList[num].d;
    let col = attributeList[num].col;
    let elem = {
        "t": "svg",
        "a": {
            "width": "60",
            "height": "60",
            "viewBox": "-2 -2 24 24"
        },
        "c": [{
                "t": "defs",
                "a": {
                    "id": "defs2"
                },
                "c": [{
                        "t": "filter",
                        "a": {
                            "inkscape:collect": "always",
                            "style": "color-interpolation-filters:sRGB",
                            "id": "filter877",
                            "x": "-1",
                            "width": "5",
                            "y": "-1",
                            "height": "5"
                        },
                        "c": [{
                            "t": "feGaussianBlur",
                            "a": {
                                "stdDeviation": "1.4"
                            }
                        }]
                    },
                    {
                        "t": "clipPath",
                        "a": {
                            "id": "cutPath-" + num
                        },
                        "c": [{
                            "t": "path",
                            "a": {
                                "d": d
                            }
                        }]
                    }
                ]
            },
            {
                "t": "path",
                "a": {
                    "d": d,
                    "class": "off",
                    "transform": "translate(1,-1)"
                }
            },
            {
                "t": "path",
                "a": {
                    "style": "fill: #" + col,
                    "d": d,
                    "class": "target-svg"
                }
            },
            {
                "t": "g",
                "a": {
                    "clip-path": "url(#cutPath-" + num + ")"
                },
                "c": [{
                    "t": "path",
                    "a": {
                        "d": d,
                        "class": "on"
                    }
                }]
            }
        ]
    }
    return elem;
}

const result = document.querySelector('#result');

for (let i = 0; i < attributeList.length; i++) {
    let elem = svg.fromData(getSvg(i));
    result.append(elem);
}