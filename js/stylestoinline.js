(function () {
    function getCss(el) {
        var sheets = document.styleSheets, ret = [];
        el.matches = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector
            || el.msMatchesSelector || el.oMatchesSelector;
        for (var i in sheets) {
            var rules = sheets[i].rules || sheets[i].cssRules;
            for (var r in rules) {
                if (el.matches(rules[r].selectorText)) {
                    ret.push(rules[r].cssText);
                }
            }
        }
        return ret;
    }
    function getStyleObj(elem) {

        // process    
        var innerCssMatcher = /\{[\n\s]*([^\}]*)[\n\s]*\}/m
        var cssTexts = getCss(elem);
        var css = {};
        for (var j = 0; j < cssTexts.length; j++) {
            var raw = cssTexts[j];
            var innerCss = raw.match(innerCssMatcher)[1];
            var styleArr = innerCss.split(';');
            for (var jj = 0; jj < styleArr.length; jj++) {
                if (styleArr[jj].trim() === '')
                    continue;

                var kvp = styleArr[jj].split(':');
                var styleKey = kvp[0].trim();
                var styleValue = kvp[1].trim();
                css[styleKey] = styleValue;
            }
        }
        return css;
    }

    function stylesToInline(elem) {
        if (elem.nodeType === Node.TEXT_NODE)
            throw Error('sorry this node type is of type: TEXT_NODE. Only non TEXT_NODE elements can be processed.');

        //process
        styleObj = getStyleObj(elem);
        var styleArr = []
        for (const key in styleObj) {
            if (styleObj.hasOwnProperty(key)) {
                var value = styleObj[key];
                styleArr.push(key + ': ' + value);
            }
        }
        var css = styleArr.length > 0 ? styleArr.join('; ') + ';' : '';
        var prevInlineStyle = elem.getAttribute('style');
        
        if (prevInlineStyle !== null && prevInlineStyle[prevInlineStyle.length - 1] !== ';')
            prevInlineStyle += ';';
        else if (prevInlineStyle === null)
            prevInlineStyle = '';
        
        var result = css + ' ' + prevInlineStyle;
        elem.setAttribute('style', result.trim());

        var childNodes = elem.childNodes;
        for (var i = 0; i < childNodes.length; i++) {
            var child = childNodes[i];
            if (child.nodeType !== Node.TEXT_NODE)
                stylesToInline(child);
        }
    }

    // export
    window.getStyle = getStyleObj;
    window.stylesToInline = stylesToInline;
})();
