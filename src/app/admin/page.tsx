"use client"

import UnitTitle from '@/components/unitTitle';
import useAdminForm from '@/hooks/useAdminForm';
import FormField from '@/components/FormField';
import FormSubmitButton from '@/components/FormSubmitButton';
import PaginationControls from '@/components/PaginationControls';

interface UnitFormData {
  title: string;
  description: string;
}

export default function AdminUnitsPage() {
  const initialValues: UnitFormData = {
    title: '',
    description: ''
  };

  const { 
    formData, 
    error, 
    loading, 
    handleChange, 
    handleSubmit 
  } = useAdminForm<UnitFormData>({
    initialValues,
    endpoint: 'Units'
  });

  return (
    <main className="max-w-4xl mx-auto p-6">
      <UnitTitle title="Create New Unit" />
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          id="title"
          name="title"
          label="Title"
          value={formData.title}
          onChange={handleChange}
        />

        <FormField
          id="description"
          name="description"
          label="Description"
          value={formData.description}
          onChange={handleChange}
          type="textarea"
        />

        {error && (
          <div className="text-red-500 text-sm">
            {error}
          </div>
        )}

        <FormSubmitButton
          loading={loading}
          loadingText="Creating..."
          text="Create Unit"
        />
      </form>
      
      <PaginationControls
        currentPage="Units"
        nextPage={{
          name: "Exercises",
          href: "/admin/exercises"
        }}
      />
    </main>
  );
} 