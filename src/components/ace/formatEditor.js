const formatEditor = editorName => {
    // Nested panels for each node
    const panels = document.getElementsByClassName('je-indented-panel')
    panels.forEach(panel => panel.classList.add('editor-panel'))

    // Select currency bar
    const tabHolders = document.getElementsByClassName('je-tabholder')
    tabHolders.forEach(tabholder => tabholder.classList.add('editor-tabholder'))

    // Currency tab button
    const tabs = document.getElementsByClassName('je-tab')
    tabs.forEach(tab => tab.classList.add('editor-tab'))

    const contents = document.getElementsByClassName('content')
    contents.forEach(content => content.classList.add('editor-content'))

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
            button.classList.add('editor-button')
        })
    })

    // Remove Collapse button & 'Agent' at top of editor
    const editor = document.getElementById(editorName)
    editor.firstChild.firstChild.style.display = 'none'

    // Remove delete last row and delete all
    const removeButtons = [
        'json-editor-btn-subtract',
        'json-editor-btntype-deleteall',
    ]
    removeButtons.forEach(buttonType => {
        const buttons = document.getElementsByClassName(buttonType)
        buttons.forEach(button => {
            button.style.display = 'none'
        })
    })

    // Field labels
    const headers = document.getElementsByClassName('je-header')
    headers.forEach(header => {
        const schema = header.parentNode.dataset.schemapath.split('.')
        if (schema.length === 3) {
            // Hide title of currency name
            header.style.display = 'none'
            header.nextSibling.style.display = 'none'
        } else if (schema[3] === 'flow_rate') {
            // Hide flow rate
            header.style.display = 'none'
            header.nextSibling.style.display = 'none'
            header.nextSibling.nextSibling.padding = '0'
        } else if (schema.length === 4) {
            header.firstChild.nextSibling.classList.add('editor-field')
        }
    })

    // Field labels
    const inputLabels = document.getElementsByClassName('je-form-input-label')
    inputLabels.forEach(label => label.classList.add('editor-field'))
}

export {formatEditor}
