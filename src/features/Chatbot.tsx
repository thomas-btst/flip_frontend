import { faComment, faComments } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormEvent, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Ollama } from 'ollama/browser'
import Markdown from 'react-markdown'

const ollama = new Ollama({ host: import.meta.env.VITE_OLLAMA_URL as string })

const context = "\
    Tu es un expert en skateboard et l'assistant IA de Flip Skateshop, une boutique spécialisée dans la vente de skateboards et de pièces détachées. \
    Ta mission est d’aider les utilisateurs en répondant de manière claire, concise et précise à leurs questions et demandes de conseils. \
    Pour toute assistance supplémentaire, ils peuvent contacter Thomas Chadecima par e-mail à thomas.chadecima@gmail.com ou par téléphone au 07 82 71 33 11.\n\
    L'utilisateur demande : \
"

interface Message {
    sender: "user" | "bot"
    content: string
    error?: boolean
}

export function Chatbot() {
    const [visible, setVisible] = useState(false)
    const [loading, setLoading] = useState(false)
    const [input, setInput] = useState("")
    const [messages, setMessages] = useState<Message[]>([{sender: "bot", content: "Bonjour, comment puis-je t'aider?"}])

    const messagesEndRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
      if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
      }
    }, [messages])

    async function sendMessage(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (input === "")
          return
        setLoading(true)
        setInput("")
    
        const userMessage: Message = { sender: "user", content: input }
        const botMessage: Message = { sender: "bot", content: "" }
    
        setMessages([...messages, userMessage, botMessage])
    
        try {
            const response = await ollama.chat({
                model: 'llama3.2:1b',
                messages: [{ role: 'user', content: context + input }],
                stream: true,
            })
    
            for await (const part of response) {
                setMessages(messages => {
                    const updatedMessages = [...messages]
                    updatedMessages[updatedMessages.length - 1] = {
                        ...updatedMessages[updatedMessages.length - 1],
                        content: updatedMessages[updatedMessages.length - 1].content + part.message.content
                    }
                    return updatedMessages
                })
            }
        } catch {
          setMessages(messages => {
              const updatedMessages = [...messages]
              updatedMessages[updatedMessages.length - 1].error = true
              return updatedMessages
          })
        } finally {
            setLoading(false)
        }
    }
    return <div className="fixed bottom-5 right-5 pointer-events-none left-5 flex justify-end z-50">
    <AnimatePresence initial={false}>
        {visible ? (
            <motion.div
                key="chatbot"
                className="relative pointer-events-auto bg-white rounded-lg shadow-xl flex flex-col overflow-hidden md:w-[26rem] max-h-[40rem]"
                initial={{ bottom: -200, right: -200, opacity: 0 }}
                animate={{ bottom: 0, right: 0, opacity: 1 }}
                exit={{ bottom: -200, right: -200, opacity: 0 }}
                transition={{ duration: 0.3 }}
            >
                {/* En-tête */}
                <div className="bg-red-600 p-4 relative">
                    <h3 className="text-white text-lg font-semibold">
                        Flip Skateshop Chat
                    </h3>
                    <button
                        onClick={() => {setVisible(false)}}
                        className="absolute top-2 right-2 text-white"
                    >
                        <FontAwesomeIcon icon={faComments} />
                    </button>
                </div>

                {/* Zone des messages */}
                <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                    {messages.map((msg, index) => 
                          msg.error ? <div key={index} className="text-red-500 text-center">Une erreur est survenue</div>
                            :
                            <div
                              key={index}
                              className={`mb-3 flex ${
                                  msg.sender === "user" ? "justify-end ml-8" : "justify-start mr-8"
                              }`}
                          >
                              <div
                                  className={`rounded-lg p-2 shadow-sm ${
                                      msg.sender === "user"
                                          ? "bg-red-500 text-white"
                                          : "bg-gray-200 text-gray-900"
                                  }`}
                              >
                                  <Markdown>{msg.content}</Markdown>
                              </div>
                          </div>
                    )}
                    <div ref={messagesEndRef}/>
                </div>

                {/* Zone de saisie */}
                <form className="p-4 bg-gray-100 flex items-center space-x-2" onSubmit={e => void sendMessage(e)}>
                    <input
                        autoFocus
                        value={input}
                        onChange={(e) => {setInput(e.target.value)}}
                        placeholder="Écrivez un message..."
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-red-500"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg disabled:bg-gray-300"
                    >
                        Envoyer
                    </button>
                </form>
            </motion.div>
        ) : (
            <motion.button
                initial={{ opacity: 0, scale: 0.2 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.2 }}
                onClick={() => {setVisible(true)}}
                className="fixed pointer-events-auto bottom-5 right-5 bg-red-500 hover:bg-red-600 text-white p-4 rounded-full shadow-lg"
            >
                <FontAwesomeIcon icon={faComment} className="size-7 mx-0.5" />
            </motion.button>
        )}
    </AnimatePresence>
</div>
}
