"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CodeSnippet {
  title: string
  language: string
  code: string
}

interface Project {
  id?: string
  title: string
  description: string
  long_description: string | null
  technologies: string[]
  image_url: string | null
  project_url: string | null
  github_url: string | null
  featured: boolean
  is_hosted: boolean
  display_order: number
  code_snippets?: CodeSnippet[]
  additional_images?: string[]
}

export function ProjectForm({ project }: { project?: Project }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: project?.title || "",
    description: project?.description || "",
    long_description: project?.long_description || "",
    technologies: project?.technologies?.join(", ") || "",
    image_url: project?.image_url || "",
    project_url: project?.project_url || "",
    github_url: project?.github_url || "",
    featured: project?.featured || false,
    is_hosted: project?.is_hosted ?? true,
    display_order: project?.display_order || 0,
  })

  const [codeSnippets, setCodeSnippets] = useState<CodeSnippet[]>(project?.code_snippets || [])
  const [additionalImages, setAdditionalImages] = useState<string[]>(project?.additional_images || [])
  const [newImageUrl, setNewImageUrl] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    console.log("[v0] Starting project submission")

    try {
      const supabase = createClient()
      console.log("[v0] Supabase client created successfully")

      const projectData = {
        title: formData.title,
        description: formData.description,
        long_description: formData.long_description || null,
        technologies: formData.technologies
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        image_url: formData.image_url || null,
        project_url: formData.project_url || null,
        github_url: formData.github_url || null,
        featured: formData.featured,
        is_hosted: formData.is_hosted,
        display_order: formData.display_order,
        code_snippets: codeSnippets,
        additional_images: additionalImages,
      }

      console.log("[v0] Project data prepared:", projectData)

      if (project?.id) {
        console.log("[v0] Updating project with ID:", project.id)
        const { error } = await supabase.from("projects").update(projectData).eq("id", project.id)

        if (error) {
          console.error("[v0] Update error:", error)
          throw error
        }

        toast({
          title: "Success!",
          description: "Project updated successfully.",
          variant: "default",
        })
      } else {
        console.log("[v0] Creating new project")
        const { error } = await supabase.from("projects").insert(projectData)

        if (error) {
          console.error("[v0] Insert error:", error)
          throw error
        }

        toast({
          title: "Success!",
          description: "Project added successfully.",
          variant: "default",
        })
      }

      console.log("[v0] Project saved successfully, redirecting...")
      router.push("/admin")
      router.refresh()
    } catch (err) {
      console.error("[v0] Error in handleSubmit:", err)
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      setError(errorMessage)

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const addCodeSnippet = () => {
    setCodeSnippets([...codeSnippets, { title: "", language: "javascript", code: "" }])
  }

  const updateCodeSnippet = (index: number, field: keyof CodeSnippet, value: string) => {
    const updated = [...codeSnippets]
    updated[index] = { ...updated[index], [field]: value }
    setCodeSnippets(updated)
  }

  const removeCodeSnippet = (index: number) => {
    setCodeSnippets(codeSnippets.filter((_, i) => i !== index))
  }

  const addImage = () => {
    if (newImageUrl.trim()) {
      setAdditionalImages([...additionalImages, newImageUrl.trim()])
      setNewImageUrl("")
    }
  }

  const removeImage = (index: number) => {
    setAdditionalImages(additionalImages.filter((_, i) => i !== index))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{project ? "Edit Project" : "Add New Project"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Project Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder="My Awesome Project"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Short Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              placeholder="A brief description of your project"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="long_description">Long Description</Label>
            <Textarea
              id="long_description"
              value={formData.long_description}
              onChange={(e) => setFormData({ ...formData, long_description: e.target.value })}
              placeholder="A detailed description of your project (optional)"
              rows={5}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="technologies">Technologies *</Label>
            <Input
              id="technologies"
              value={formData.technologies}
              onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
              required
              placeholder="React, Next.js, TypeScript, Tailwind CSS"
            />
            <p className="text-sm text-muted-foreground">Separate technologies with commas</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url">Image URL</Label>
            <Input
              id="image_url"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              placeholder="/placeholder.svg?height=400&width=600"
            />
          </div>

          <div className="space-y-2">
            <Label>Additional Images</Label>
            <div className="flex gap-2">
              <Input
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Image URL"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addImage()
                  }
                }}
              />
              <Button type="button" onClick={addImage} variant="outline">
                Add
              </Button>
            </div>
            {additionalImages.length > 0 && (
              <div className="space-y-2 mt-2">
                {additionalImages.map((url, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                    <span className="flex-1 text-sm truncate">{url}</span>
                    <Button type="button" size="sm" variant="ghost" onClick={() => removeImage(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Code Snippets</Label>
              <Button type="button" onClick={addCodeSnippet} variant="outline" size="sm">
                Add Code Snippet
              </Button>
            </div>
            {codeSnippets.map((snippet, index) => (
              <Card key={index}>
                <CardContent className="pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Snippet {index + 1}</Label>
                    <Button type="button" size="sm" variant="ghost" onClick={() => removeCodeSnippet(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <Input
                    placeholder="Snippet title"
                    value={snippet.title}
                    onChange={(e) => updateCodeSnippet(index, "title", e.target.value)}
                  />
                  <Input
                    placeholder="Language (e.g., javascript, python, typescript)"
                    value={snippet.language}
                    onChange={(e) => updateCodeSnippet(index, "language", e.target.value)}
                  />
                  <Textarea
                    placeholder="Paste your code here"
                    value={snippet.code}
                    onChange={(e) => updateCodeSnippet(index, "code", e.target.value)}
                    rows={6}
                    className="font-mono text-sm"
                  />
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="project_url">Live Demo URL</Label>
            <Input
              id="project_url"
              type="url"
              value={formData.project_url}
              onChange={(e) => setFormData({ ...formData, project_url: e.target.value })}
              placeholder="https://example.com"
              disabled={!formData.is_hosted}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="github_url">GitHub URL</Label>
            <Input
              id="github_url"
              type="url"
              value={formData.github_url}
              onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
              placeholder="https://github.com/username/repo"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="display_order">Display Order</Label>
            <Input
              id="display_order"
              type="number"
              value={formData.display_order}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  display_order: Number.parseInt(e.target.value) || 0,
                })
              }
              placeholder="0"
            />
            <p className="text-sm text-muted-foreground">Lower numbers appear first</p>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_hosted"
              checked={formData.is_hosted}
              onCheckedChange={(checked) => {
                setFormData({
                  ...formData,
                  is_hosted: checked as boolean,
                  project_url: checked ? formData.project_url : "",
                })
              }}
            />
            <Label htmlFor="is_hosted" className="cursor-pointer">
              Project has a live demo
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="featured"
              checked={formData.featured}
              onCheckedChange={(checked) => setFormData({ ...formData, featured: checked as boolean })}
            />
            <Label htmlFor="featured" className="cursor-pointer">
              Feature this project
            </Label>
          </div>

          {error && <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">{error}</div>}

          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : project ? "Update Project" : "Add Project"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push("/admin")}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
