const formatEditor = (editorName) => {
    var editor = document.getElementById(editorName)

    // Remove Collapse button & 'Agent' at top of editor
    editor.firstChild.firstChild.setAttribute("style", "display: none;")
    var editJsonBtn = document.getElementsByClassName('json-editor-btn-edit')
    editJsonBtn[0].parentElement.style.margin = "0"

    // Remove all outlines
    var panels = document.getElementsByClassName('je-indented-panel')
    panels.forEach(panel => {
        panel.style.border = "none";
        panel.style.paddingLeft = '0px';
        panel.style.margin = 0;    
    })

    var tabHolders = document.getElementsByClassName('je-tabholder')
    tabHolders.forEach(tabholder => {
        tabholder.style.display = "flex"
        tabholder.style.flexDirection = "row"
        tabholder.style.justifyContent = "flex-start"
        tabholder.style.width = "100%"
        tabholder.style.marginTop = "-28px"
        tabholder.style.overflowY = "hidden"
        tabholder.style.overflowX = "auto"
    })

    var tabs = document.getElementsByClassName('je-tab')
    tabs.forEach(tab => {
        tab.style.color = "black"
        tab.style.borderRadius = "5px 5px 0 0";
        tab.style.padding = "5px";
        tab.style.fontSize = "12pt";
        tab.style.fontWeight = "400";
        tab.style.lineHeight = '1em';
        tab.style.border = "1px solid #eee";
    })

    var contents = document.getElementsByClassName('content')
    contents.forEach(content => {
        content.style.marginLeft = "0px"
        content.style.marginTop = "40px"
        content.style.padding = "16px"
        content.style.border = "1px solid #eee"
    }) 

    // Buttons match dashboard panel buttons
    // Collapse, Expand, Add, Delete, EditJSON
    const buttonTypes = [
        'json-editor-btn-collapse',
        'json-editor-btn-edit',
        'json-editor-btn-add',
        'json-editor-btn-delete',
    ]
    buttonTypes.forEach(type => {
        document.getElementsByClassName(type).forEach(button => {
            button.style.padding = '3px 8px'
            button.style.color = '#eee'
            button.style.backgroundColor = 'transparent'
            button.style.border = '1px solid #eee'
            button.style.borderRadius = '3px'
        })
    })

    // Remove delete last row and delete all
    const removeButtons = [
        'json-editor-btn-subtract',
        'json-editor-btntype-deleteall',
    ]
    removeButtons.forEach(buttonType => {
        var buttons = document.getElementsByClassName(buttonType)
        buttons.forEach(button => {
            button.style.display = "none"
        })
    })

    var headers = document.getElementsByClassName('je-header')
    headers.forEach(header => {
        var schema = header.parentNode.dataset.schemapath.split(".")

        if (schema.length === 3) {
            // Hide title of currency name
            header.style.display = "none"
            header.nextSibling.style.display = "none"
        } else if (schema[3] === 'flow_rate') {
                header.style.display = "none"
                header.nextSibling.style.display = "none"
                header.nextSibling.nextSibling.padding = "0"
        } else if (schema.length === 4) {
            header.style.size = "12pt"
            header.style.fontWeight = "200"
        }
    })

    // Currency, Value Flow Rate.. -level titles green/bold
    var inputLabels = document.getElementsByClassName("je-form-input-label")
    inputLabels.forEach(label => {
        label.style.fontSize = "12pt"
        label.style.fontWeight = "200"
    })

    // Error Messages right of input


}

export { formatEditor }
