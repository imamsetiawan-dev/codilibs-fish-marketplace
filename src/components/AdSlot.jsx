import { useState, useEffect } from 'react'
import { getAds } from '../api/api'

function AdSlot({ slot, className }) {
  const [ad, setAd] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const data = await getAds(slot)
        if (Array.isArray(data) && data.length > 0) {
          setAd(data[0])
        }
      } catch (err) {
        console.error('AdSlot Error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchAd()
  }, [slot])

  if (loading) return null

  if (!ad) {
    return (
      <div className={`w-full bg-gray-100 border border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400 text-xs ${className || ''}`}>
        Slot Iklan
      </div>
    )
  }

  if (ad.type === 'image' && ad.imageUrl) {
    return (
      <div className={`w-full overflow-hidden  ${className || ''}`}>
        <a href={ad.linkUrl || '#'} target="_blank" rel="noopener noreferrer">
          <img src={ad.imageUrl} alt={ad.title} className="w-full h-full object-cover" />
        </a>
      </div>
    )
  }

  if (ad.type === 'adsense' && ad.adsenseCode) {
    return (
      <div
        className={`w-full overflow-hidden rounded-xl ${className || ''}`}
        dangerouslySetInnerHTML={{ __html: ad.adsenseCode }}
      />
    )
  }

  if (ad.type === 'custom' && ad.customCode) {
    return (
      <div
        className={`w-full overflow-hidden rounded-xl ${className || ''}`}
        dangerouslySetInnerHTML={{ __html: ad.customCode }}
      />
    )
  }

  return null
}

export default AdSlot
