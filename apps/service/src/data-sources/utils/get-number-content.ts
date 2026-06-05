const getNumberContent: (element: Element, selector: string) => number = (element, selector) => {
    const target = selector ? element.querySelector(selector) : element

    if (target && typeof target.textContent === 'string') {
        return Number(target.textContent.replace(/,/g, '').trim())
    }

    throw new Error('HTML Node textContent not found')
}

export { getNumberContent }
