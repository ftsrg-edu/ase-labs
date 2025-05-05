import { useCallback, useEffect, useState } from 'react'
import { Address } from 'viem'

export default function useNavigation() {
    // The page to display
    const [page, setPage] = useState('home' as 'home' | 'simple' | 'blind')
    const [auction, setAuction] = useState(null as Address | null)

    function parseUrl(url: string) {
        const urlParts = url.split('/')
        if (urlParts.length === 3 && urlParts[1] === 'simple') {
            setPage('simple')
            setAuction(urlParts[2] as Address)
        } else if (urlParts.length === 3 && urlParts[1] === 'blind') {
            setPage('blind')
            setAuction(urlParts[2] as Address)
        } else {
            setPage('home')
            setAuction(null)
        }
    }

    // Navigate to the correct page on load
    useEffect(() => {
        parseUrl(window.location.pathname)

        window.addEventListener('popstate', (e) => {
            if (e.state) {
                setPage(e.state)
            } else {
                parseUrl(window.location.pathname)
            }
        })
    }, [])

    // Navigate to another page
    const navigate = useCallback(
        (newPage: 'home' | 'simple' | 'blind', newAuction: Address | null) => {
            if (page !== newPage || auction !== newAuction) {
                const url =
                    newPage === 'home' ? '/' : newPage === 'simple' ? `/simple/${newAuction}` : `/blind/${newAuction}`
                window.history.pushState(url, '', url)
                setPage(newPage)
                setAuction(newAuction)
            }
        },
        [page, auction]
    )

    // Set the title
    useEffect(() => {
        if (page === 'home') {
            document.title = 'Home'
        } else if (page === 'simple') {
            document.title = `${auction} - Simple Auction`
        } else {
            document.title = `${auction} - Blind Auction`
        }
    }, [page, auction])

    return [page, auction, navigate] as const
}
