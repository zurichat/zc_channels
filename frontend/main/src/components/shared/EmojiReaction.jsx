/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */
import React, { useState } from "react"
import Picker from "emoji-picker-react"
import DisplayEmojiReaction from "./DisplayEmojiReaction"

export default function App() {
  const [emojis, setEmojis] = useState([])

  const addEmojis = text => {
    const _emojis = [...emojis]
    const updatedEmojis = getUpdatedEmojis(text, _emojis)
    setEmojis(updatedEmojis)
  }

  const onEmojiClick = (event, emojiObject) => {
    const text = emojiObject.emoji
    addEmojis(text)
  }

  const getUpdatedEmojis = (text, emojiStore) => {
    // check if  emoji exist in the array
    const newEmoji = {}
    const emoji = emojiStore.find(item => item.emoji === text)
    const emojiIndex = emojiStore.findIndex(item => item.emoji === text)
    if (emojiIndex && emojiIndex < 0) {
      newEmoji.emoji = text
      newEmoji.count = 0
      emojiStore.push(newEmoji)
      return emojiStore
    }
    emoji.count += 1
    emojiStore[emojiIndex] = emoji
    return emojiStore
  }

  return (
    <div>
      <Picker onEmojiClick={onEmojiClick} />
      <DisplayEmojiReaction emojis={emojis} handleIncrement={addEmojis} />
    </div>
  )
}
