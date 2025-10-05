import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, ExternalLink, Mail, Linkedin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Project {
  id: string;
  title: string;
  description: string;
  long_description: string | null;
  technologies: string[];
  image_url: string | null;
  project_url: string | null;
  github_url: string | null;
  featured: boolean;
  is_hosted: boolean;
  display_order: number;
}

export default async function HomePage() {
  const supabase = await createClient();

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("display_order", { ascending: true });

  const featuredProjects = projects?.filter((p) => p.featured) || [];
  const otherProjects = projects?.filter((p) => !p.featured) || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Your Name</h1>
          <nav className="flex items-center gap-4">
            <Link href="#projects">
              <Button variant="ghost" size="sm">
                Projecten
              </Button>
            </Link>
            <Link href="#contact">
              <Button variant="ghost" size="sm">
                Contact
              </Button>
            </Link>
            <Link href="/admin">
              <Button variant="outline" size="sm">
                Admin
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="flex flex-col md:flex-row items-center gap-12 max-w-6xl">
          <div className="flex-1">
            <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6 text-balance">
              Hi, Mijn naam is Jasper van den Heuvel
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              ik ben een HBO-ICT student met een passie voor full-stack
              development. Ik bouw complete webapplicaties waarin de front-end
              en back-end naadloos samenwerken. Mijn kracht ligt in het
              ontwikkelen van schaalbare systemen, overzichtelijke interfaces en
              het vertalen van gebruikersbehoeften naar technische oplossingen.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link href="#projects">Bekijk mijn werk</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#contact">Neem Contact Op</Link>
              </Button>
            </div>
          </div>
          <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-primary/20 shadow-xl flex-shrink-0">
            <Image
              src="/hero-image.jpg"
              alt="Jasper van den Heuvel - Portfolio Photo"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section id="projects" className="container mx-auto px-4 py-16">
          <h3 className="text-3xl font-bold text-foreground mb-8">
            Voorgestelde Projecten
          </h3>
          <div className="grid gap-8 md:grid-cols-2">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} featured />
            ))}
          </div>
        </section>
      )}

      {/* Other Projects */}
      {otherProjects.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <h3 className="text-3xl font-bold text-foreground mb-8">
            Meer Projecten
          </h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {otherProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section id="contact" className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-6">
            <h3 className="text-3xl font-bold text-foreground mb-4">
              Laten we Connecten
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Ik ben momenteel op zoek naar een stageplek waar ik kan bijdragen
              en tegelijkertijd veel kan leren. Neem gerust contact met me op!
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild>
                <a href="mailto:jasperheuvel13@gmail.com">
                  <Mail className="mr-2 h-4 w-4" />
                  Email Me
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a
                  href="https://github.com/Jasper20037"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a
                  href="https://www.linkedin.com/in/jasper-van-den-heuvel-00424a193/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin className="mr-2 h-4 w-4" />
                  LinkedIn
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>© 2025 Jasper van den Heuvel. Gebouwd met Next.js and Supabase.</p>
        </div>
      </footer>
    </div>
  );
}

function ProjectCard({
  project,
  featured = false,
}: {
  project: Project;
  featured?: boolean;
}) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {project.image_url && (
        <div className="relative w-full h-48 bg-muted">
          <Image
            src={project.image_url || "/placeholder.svg"}
            alt={project.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <CardContent className="p-6">
        <h4 className="text-xl font-bold text-foreground mb-2">
          {project.title}
        </h4>
        <p className="text-muted-foreground mb-4 leading-relaxed">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.map((tech) => (
            <Badge key={tech} variant="secondary">
              {tech}
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          {project.is_hosted && project.project_url && (
            <Button size="sm" variant="outline" asChild>
              <a
                href={project.project_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Live Demo
              </a>
            </Button>
          )}
          {project.github_url && (
            <Button size="sm" variant="outline" asChild>
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="mr-2 h-4 w-4" />
                Code
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
