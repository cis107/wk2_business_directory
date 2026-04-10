// app/contact/page.tsx
"use client";

import { useState, useEffect } from "react";

interface FormData {
  name: string;
  email: string;
  cell: string;
  comment: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  cell?: string;
  comment?: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    cell: "",
    comment: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  // Real-time email validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // Real-time phone validation
const validatePhone = (phone: string): boolean => {
  // Breakdown:
  // ^(\+?\d{1,3})?  -> Optional country code (e.g., +1 or 1)
  // \s?             -> Optional space
  // \(?\d{3}\)?     -> Area code, optional brackets
  // [\s.-]?         -> Optional separator (space, dot, or dash)
  // \d{3}           -> First 3 digits
  // [\s.-]?         -> Optional separator
  // \d{4}$          -> Last 4 digits
  
  const phoneRegex = /^(\+?\d{1,3})?[\s-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
  return phoneRegex.test(phone.trim());
};

  // Format phone number as user types
  const formatPhoneNumber = (value: string): string => {
    // Remove all non-digits
    const numbers = value.replace(/\D/g, "");
    
    if (numbers.length === 0) return "";
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) {
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    }
    return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
  };

  // Format email as user types (optional: convert to lowercase)
  const formatEmail = (value: string): string => {
    return value.toLowerCase().trim();
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formatted = formatPhoneNumber(rawValue);
    
    setFormData((prev) => ({ ...prev, cell: formatted }));
    
    // Real-time validation feedback
    if (formatted.length > 0 && !validatePhone(formatted)) {
      setErrors((prev) => ({ 
        ...prev, 
        cell: "Please enter a valid phone number (e.g., (925) 555-0101)" 
      }));
    } else if (formatted.length > 0 && validatePhone(formatted)) {
      setErrors((prev) => ({ ...prev, cell: undefined }));
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formatted = formatEmail(rawValue);
    
    setFormData((prev) => ({ ...prev, email: formatted }));
    
    // Real-time validation feedback
    if (formatted.length > 0 && !validateEmail(formatted)) {
      setErrors((prev) => ({ 
        ...prev, 
        email: "Please enter a valid email address (e.g., name@example.com)" 
      }));
    } else if (formatted.length > 0 && validateEmail(formatted)) {
      setErrors((prev) => ({ ...prev, email: undefined }));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === "email") {
      handleEmailChange(e as React.ChangeEvent<HTMLInputElement>);
    } else if (name === "cell") {
      handlePhoneChange(e as React.ChangeEvent<HTMLInputElement>);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (errors[name as keyof FormErrors]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Validate email with proper format
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email format. Example: name@domain.com";
    }

    // Validate phone with proper format
    if (!formData.cell.trim()) {
      newErrors.cell = "Cell phone number is required";
    } else if (!validatePhone(formData.cell)) {
      newErrors.cell = "Invalid phone format. Example: (925) 555-0101 or 925-555-0101";
    }

    // Validate comment
    if (!formData.comment.trim()) {
      newErrors.comment = "Comment is required";
    } else if (formData.comment.length < 10) {
      newErrors.comment = "Please provide at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // Scroll to first error
      const firstError = document.querySelector(".border-red-500");
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus({
          type: "success",
          message: "✓ Message sent successfully! We'll get back to you soon.",
        });
        // Reset form
        setFormData({
          name: "",
          email: "",
          cell: "",
          comment: "",
        });
        setErrors({});
      } else {
        throw new Error("Failed to submit form");
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "✗ Failed to send message. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
          Contact Us
        </h1>
        <p className="text-lg text-gray-600">
          We'd love to hear from you. Send us a message and we'll respond as
          soon as possible.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <span>⚠️</span> {errors.name}
                  </p>
                )}
              </div>

              {/* Email Field with Real-time Formatting */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors font-mono ${
                    errors.email ? "border-red-500" : 
                    formData.email && validateEmail(formData.email) ? "border-green-500" : "border-gray-300"
                  }`}
                  placeholder="name@example.com"
                  autoCapitalize="none"
                  autoComplete="email"
                />
                {formData.email && validateEmail(formData.email) && !errors.email && (
                  <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
                    <span>✓</span> Valid email format
                  </p>
                )}
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <span>⚠️</span> {errors.email}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Example: john.doe@company.com
                </p>
              </div>

              {/* Cell Phone Field with Real-time Formatting */}
              <div>
                <label
                  htmlFor="cell"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Cell Phone *
                </label>
                <input
                  type="tel"
                  id="cell"
                  name="cell"
                  value={formData.cell}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors font-mono ${
                    errors.cell ? "border-red-500" : 
                    formData.cell && validatePhone(formData.cell) ? "border-green-500" : "border-gray-300"
                  }`}
                  placeholder="(925) 555-0101"
                  autoComplete="tel"
                />
                {formData.cell && validatePhone(formData.cell) && !errors.cell && (
                  <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
                    <span>✓</span> Valid phone number format
                  </p>
                )}
                {errors.cell && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <span>⚠️</span> {errors.cell}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Accepted formats: (925) 555-0101, 925-555-0101, 9255550101
                </p>
              </div>

              {/* Comment Field */}
              <div>
                <label
                  htmlFor="comment"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Comment / Message *
                </label>
                <textarea
                  id="comment"
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                  rows={5}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none ${
                    errors.comment ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Please share your thoughts, questions, or feedback... (minimum 10 characters)"
                />
                {formData.comment && formData.comment.length >= 10 && !errors.comment && (
                  <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
                    <span>✓</span> {formData.comment.length}/10 characters
                  </p>
                )}
                {formData.comment && formData.comment.length < 10 && (
                  <p className="mt-1 text-sm text-orange-600 flex items-center gap-1">
                    <span>ℹ️</span> {formData.comment.length}/10 characters minimum
                  </p>
                )}
                {errors.comment && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <span>⚠️</span> {errors.comment}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>

              {/* Status Message */}
              {submitStatus.type && (
                <div
                  className={`p-4 rounded-lg ${
                    submitStatus.type === "success"
                      ? "bg-green-50 text-green-800 border border-green-200"
                      : "bg-red-50 text-red-800 border border-red-200"
                  }`}
                >
                  {submitStatus.message}
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Contact Info Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Get in Touch
            </h3>
            <p className="text-gray-600 mb-6">
              Have questions about our business directory? We're here to help!
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">📞</span>
                <div>
                  <p className="font-semibold text-gray-900">Phone</p>
                  <p className="text-gray-600 text-sm">(925) 555-0000</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-2xl">✉️</span>
                <div>
                  <p className="font-semibold text-gray-900">Email</p>
                  <p className="text-gray-600 text-sm">support@businesscards.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-2xl">📍</span>
                <div>
                  <p className="font-semibold text-gray-900">Address</p>
                  <p className="text-gray-600 text-sm">
                    123 Business Ave<br />
                    Suite 100<br />
                    Pleasanton, CA 94588
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                <strong>Formatting tips:</strong><br />
                • Email: name@domain.com<br />
                • Phone: (925) 555-0101
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}