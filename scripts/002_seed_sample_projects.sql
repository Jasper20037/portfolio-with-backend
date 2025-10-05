-- Insert sample projects to get you started
insert into public.projects (title, description, long_description, technologies, image_url, project_url, github_url, featured, display_order)
values 
  (
    'E-Commerce Platform',
    'A full-stack e-commerce solution with payment integration',
    'Built a complete e-commerce platform featuring user authentication, product management, shopping cart functionality, and secure payment processing using Stripe. Implemented responsive design and optimized for performance.',
    array['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Stripe', 'PostgreSQL'],
    '/placeholder.svg?height=400&width=600',
    'https://example.com',
    'https://github.com/yourusername/ecommerce',
    true,
    1
  ),
  (
    'Task Management App',
    'Collaborative task management tool with real-time updates',
    'Developed a real-time task management application that allows teams to collaborate effectively. Features include drag-and-drop task boards, real-time notifications, user assignments, and progress tracking.',
    array['React', 'Node.js', 'Socket.io', 'MongoDB', 'Express'],
    '/placeholder.svg?height=400&width=600',
    'https://example.com',
    'https://github.com/yourusername/taskmanager',
    true,
    2
  ),
  (
    'Weather Dashboard',
    'Real-time weather tracking with beautiful visualizations',
    'Created an interactive weather dashboard that displays current conditions, forecasts, and historical data. Integrated with multiple weather APIs and implemented data visualization using charts and maps.',
    array['Vue.js', 'JavaScript', 'Chart.js', 'Weather API', 'CSS3'],
    '/placeholder.svg?height=400&width=600',
    'https://example.com',
    'https://github.com/yourusername/weather',
    false,
    3
  );
