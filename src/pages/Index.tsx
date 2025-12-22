import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { showSuccess, showError } from "@/utils/toast";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Mail, Phone, MapPin, Star, Zap, Shield, AlertTriangle, FileText, ArrowRight, Check } from "lucide-react";
import { apiClient } from "@/lib/api";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Client-side validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length > 100) {
      newErrors.name = "Name must be less than 100 characters";
    } else if (!/^[a-zA-Z\s'-]+$/.test(formData.name)) {
      newErrors.name = "Name can only contain letters, spaces, hyphens, and apostrophes";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (formData.email.length > 254) {
      newErrors.email = "Email is too long";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    } else if (formData.message.length > 2000) {
      newErrors.message = "Message must be less than 2000 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form on client side first
    if (!validateForm()) {
      showError("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);

    try {
      // Use secure API endpoint
      const response = await apiClient.post('/api/contact', formData);
      
      if (response.success) {
        showSuccess(response.message || "Form submitted successfully!");
        setFormData({ name: "", email: "", message: "" });
        setErrors({});
      } else {
        showError(response.error || "Failed to submit form");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to submit form. Please try again.";
      showError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to Your
            <span className="text-blue-600"> Secure App</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Transform your ideas into reality with our powerful platform. Built with security-first architecture to protect your data.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="text-lg px-8"
              onClick={() => navigate("/create-dfd")}
            >
              Create DFD
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Security Notice */}
      <section className="py-8 px-4 bg-blue-50 border-y border-blue-200">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 text-blue-800">
            <Shield className="w-6 h-6" />
            <div>
              <h3 className="font-semibold">Enhanced Security Active</h3>
              <p className="text-sm text-blue-700">
                This application uses Content Security Policy (CSP), rate limiting, CSRF protection, and input validation to keep your data safe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Why Choose Us
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6 border-0 shadow-lg">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Lightning Fast</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Experience blazing fast performance with our optimized infrastructure and cutting-edge technology.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center p-6 border-0 shadow-lg">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Secure & Reliable</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Your data is protected with enterprise-grade security, CSP headers, rate limiting, and server-side API processing.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center p-6 border-0 shadow-lg">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Star className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Easy to Use</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Intuitive interface designed for both beginners and experts. No learning curve required.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* DFD Feature Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Create Professional DFDs</h2>
              </div>
              <p className="text-lg text-gray-600 mb-6">
                Generate comprehensive Data Flow Diagrams with our advanced form system. Perfect for procurement processes and documentation.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">Process number validation with AND condition logic</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">AI-powered text improvement</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">PDF generation with professional formatting</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">Comprehensive form validation</span>
                </li>
              </ul>
              <Button 
                size="lg" 
                className="text-lg px-8"
                onClick={() => navigate("/create-dfd")}
              >
                Start Creating DFD
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Get In Touch
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold mb-6">Let's Start a Conversation</h3>
              <p className="text-gray-600 mb-8">
                Have questions about our services? Want to see a demo? Fill out the form and our team will get back to you within 24 hours.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-600">hello@example.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-600">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-600">123 Business St, City, State 12345</span>
                </div>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Send us a message</CardTitle>
                <CardDescription>
                  We'd love to hear from you
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={errors.name ? "border-red-500" : ""}
                      maxLength={100}
                      required
                    />
                    {errors.name && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" />
                        {errors.name}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={errors.email ? "border-red-500" : ""}
                      maxLength={254}
                      required
                    />
                    {errors.email && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" />
                        {errors.email}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell us how we can help you..."
                      value={formData.message}
                      onChange={handleInputChange}
                      className={errors.message ? "border-red-500" : ""}
                      rows={4}
                      maxLength={2000}
                      required
                    />
                    {errors.message && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" />
                        {errors.message}
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      {formData.message.length}/2000 characters
                    </p>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
          <p className="text-gray-400 mb-6">Join thousands of satisfied customers today</p>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            Start Free Trial
          </Button>
        </div>
      </footer>

      <MadeWithDyad />
    </div>
  );
};

export default Index;