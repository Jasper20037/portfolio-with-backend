import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Github, ExternalLink, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"

interface CodeSnippet {
  title: string
  language: string
  code: string
}

interface Project {
  id: string
  title: string
  description: string
  long_description: string | null
  technologies: string[]
  image_url: string | null
  project_url: string | null
  github_url: string | null
  featured: boolean
  is_hosted: boolean
  code_snippets: CodeSnippet[]
  additional_images: string[]
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: project, error } = await supabase.from("projects").select("*").eq("id", id).single()

  if (error || !project) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50 animate-fade-in">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-4 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Portfolio
            </Button>
          </Link>
          <Link href="/admin">
            <Button variant="outline" size="sm">
              Admin
            </Button>
          </Link>
        </div>
      </header>

      {/* Project Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl py-12">
        {/* Hero Image */}
        {project.image_url && (
          <div className="relative w-full h-64 sm:h-96 rounded-lg overflow-hidden mb-8 animate-scale-in">
            <Image
              src={project.image_url || "/placeholder.svg"}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Title and Actions */}
        <div className="mb-8 animate-fade-in-up animation-delay-100">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance">{project.title}</h1>
          <p className="text-xl text-muted-foreground mb-6 leading-relaxed">{project.description}</p>

          <div className="flex flex-wrap gap-3 mb-6">
            {project.is_hosted && project.project_url && (
              <Button asChild>
                <a href={project.project_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Live Demo
                </a>
              </Button>
            )}
            {project.github_url && (
              <Button variant="outline" asChild>
                <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  View Code
                </a>
              </Button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <Badge key={tech} variant="secondary">
                {tech}
              </Badge>
            ))}
          </div>
        </div>

        {/* Long Description */}
        {project.long_description && (
          <Card className="mb-8 animate-fade-in animation-delay-200">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">About This Project</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{project.long_description}</p>
            </CardContent>
          </Card>
        )}

        {/* Additional Images */}
        {project.additional_images && project.additional_images.length > 0 && (
          <div className="mb-8 animate-fade-in animation-delay-300">
            <h2 className="text-2xl font-bold text-foreground mb-4">Project Gallery</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {project.additional_images.map((imageUrl, index) => (
                <div
                  key={index}
                  className="relative w-full h-64 rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105"
                >
                  <Image
                    src={imageUrl || "/placeholder.svg"}
                    alt={`${project.title} screenshot ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Code Snippets */}
        {project.code_snippets && project.code_snippets.length > 0 && (
          <div className="mb-8 animate-fade-in animation-delay-400">
            <h2 className="text-2xl font-bold text-foreground mb-4">Code Highlights</h2>
            <div className="space-y-4">
              {project.code_snippets.map((snippet, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-foreground">{snippet.title}</h3>
                      <Badge variant="outline">{snippet.language}</Badge>
                    </div>
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm font-mono">{snippet.code}</code>
                    </pre>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Back Button */}
        <div className="mt-12">
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to All Projects
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
