'use client'

import { useState } from 'react'
import { Menu, Search, ArrowLeft, ThumbsUp, MessageSquare } from 'lucide-react'

const posts = [
  {
    id: 1,
    title: "What's a crochet \"hack\" that changed how you crochet?",
    author: "r/crochet",
    text: "This is where the full post content would go. For this example, we're just displaying the title and metadata.",
    time: "1y ago",
    votes: 767,
    comments: 378,
  },
]
const communities = [
  { name: "r/crochet", members: "1.4M", online: 114 },
]

export default function CrochetCommunity() {
  const [selectedPost, setSelectedPost] = useState(null)
  const [searchQuery, setSearchQuery] = useState("crochet")
  const [activeTab, setActiveTab] = useState("posts")

  const handlePostClick = (post) => {
    setSelectedPost(post)
  }

  const handleBackClick = () => {
    setSelectedPost(null)
  }

  return (
      <div className="min-h-screen bg-[#1A1A1B] text-gray-200 relative">
        {/* Decorative border */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute left-0 top-0 w-full h-full bg-[url('/placeholder.svg?height=600&width=600')] bg-repeat opacity-10" />
        </div>

        {/* Header */}
        <header className="sticky top-0 z-10 bg-[#1A1A1B] border-b border-gray-700">
          <div className="container mx-auto px-4 py-2 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="text-gray-400">
                <Menu className="h-6 w-6" />
              </button>
              <svg className="h-8 w-8 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
                <circle cx="10" cy="10" r="10" />
                <path fill="white" d="M16.5,10.3c-0.8,1.3-2,2.3-3.5,2.8c-1.4,0.5-3,0.5-4.4,0c-1.5-0.5-2.7-1.5-3.5-2.8c-0.8-1.3-1.1-2.8-0.9-4.3 c0.2-1.5,0.9-2.8,2-3.9c1.1-1.1,2.5-1.8,4-2c1.5-0.2,3,0.1,4.3,0.9c1.3,0.8,2.3,2,2.8,3.5c0.5,1.4,0.5,3,0,4.4 C17.6,9.3,17.1,9.9,16.5,10.3z"/>
              </svg>
              <span className="text-2xl font-bold text-white">reddit</span>
            </div>
            <div className="flex-1 max-w-xl mx-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search Reddit"
                    className="pl-9 bg-[#272729] border-gray-700 text-white w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2">Log In</button>
          </div>
        </header>

        {/* Main content */}
        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              {selectedPost ? (
                  <div className="bg-[#1A1A1B] border-gray-700 p-4">
                    <button
                        className="text-gray-400 mb-4 flex items-center"
                        onClick={handleBackClick}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to posts
                    </button>
                    <h2 className="text-xl text-white">{selectedPost.title}</h2>
                    <div className="text-gray-400 mt-4">
                      Posted by {selectedPost.author} {selectedPost.time}
                      <div className="mt-4 text-gray-300">
                        {/* Placeholder for post content */}
                        {selectedPost.text}
                      </div>
                    </div>
                  </div>
              ) : (
                  <>
                    <div className="mb-6">
                      <div className="bg-[#272729] border-b border-gray-700 flex">
                        <button className={`flex-1 py-2 ${activeTab === "posts" && "text-white"}`} onClick={() => setActiveTab("posts")}>Posts</button>
                        <button className={`flex-1 py-2 ${activeTab === "communities" && "text-white"}`} onClick={() => setActiveTab("communities")}>Communities</button>
                        <button className={`flex-1 py-2 ${activeTab === "comments" && "text-white"}`} onClick={() => setActiveTab("comments")}>Comments</button>
                        <button className={`flex-1 py-2 ${activeTab === "media" && "text-white"}`} onClick={() => setActiveTab("media")}>Media</button>
                        <button className={`flex-1 py-2 ${activeTab === "people" && "text-white"}`} onClick={() => setActiveTab("people")}>People</button>
                      </div>
                    </div>
                    {activeTab === "posts" && posts.map((post) => (
                        <div key={post.id} className="mb-4 bg-[#1A1A1B] border-gray-700 hover:border-gray-500 cursor-pointer p-4" onClick={() => handlePostClick(post)}>
                          <div className="flex items-center space-x-2 text-gray-400 text-sm mb-2">
                            <span>{post.author}</span>
                            <span>•</span>
                            <span>{post.time}</span>
                          </div>
                          <h3 className="text-lg font-semibold text-white mb-2">{post.title}</h3>
                          <div className="flex items-center space-x-4 text-gray-400">
                            <div className="flex items-center">
                              <ThumbsUp className="h-4 w-4 mr-1" />
                              <span>{post.votes}</span>
                            </div>
                            <div className="flex items-center">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              <span>{post.comments}</span>
                            </div>
                          </div>
                        </div>
                    ))}
                    {activeTab !== "posts" && (
                        <div className="bg-[#1A1A1B] border-gray-700 p-4">
                          <p className="text-gray-400">Content for {activeTab} would be displayed here.</p>
                        </div>
                    )}
                  </>
              )}
            </div>
            <div className="lg:w-80">
              <div className="bg-[#1A1A1B] border-gray-700 p-4">
                <h2 className="text-white">Communities</h2>
                {communities.map((community, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-700 last:border-0">
                      <div>
                        <h4 className="text-white font-medium">{community.name}</h4>
                        <p className="text-sm text-gray-400">{community.members} members</p>
                      </div>
                      <div className="text-xs text-gray-400">{community.online} online</div>
                    </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
  )
}