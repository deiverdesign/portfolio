import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CaseCardLarge } from "./CaseCardLarge";

const meta = {
  title: "Design System/CaseCardLarge",
  component: CaseCardLarge,
  parameters: { layout: "padded" },
} satisfies Meta<typeof CaseCardLarge>;

export default meta;
type Story = StoryObj<typeof meta>;

const placeholderImage =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='400' height='260'><rect width='100%' height='100%' fill='#d9d9d9'/></svg>"
  );

const baseArgs = {
  number: "01",
  title: "Case Study Title",
  summary: "Uma frase resumindo o problema e o resultado do projeto.",
  description:
    "Descrição mais longa explicando o contexto, o problema enfrentado e a abordagem de design utilizada neste case.",
  tags: ["Tag um", "Tag dois", "Tag três"],
  href: "#",
  imageSrc: placeholderImage,
  imageAlt: "Imagem ilustrativa do case",
};

export const Default: Story = {
  args: { ...baseArgs },
  decorators: [(Story) => <div style={{ maxWidth: 413 }}><Story /></div>],
};

/** Mais de 3 tags — mostra o "+N more" (Priority+), calibrado em responsive-rules.md. */
export const WithOverflowTags: Story = {
  args: {
    ...baseArgs,
    tags: ["Tag um", "Tag dois", "Tag três", "Tag quatro"],
  },
  decorators: [(Story) => <div style={{ maxWidth: 413 }}><Story /></div>],
};

/** Grade completa — 3 colunas no desktop, 2 no tablet, 1 no mobile (redimensione a janela). */
export const ResponsiveGrid: Story = {
  args: { ...baseArgs },
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
      <CaseCardLarge
        number="01"
        title="Case Study One"
        summary="Uma frase resumindo o problema e o resultado do projeto."
        description="Descrição mais longa explicando o contexto, o problema enfrentado e a abordagem de design utilizada neste case."
        tags={["Tag um", "Tag dois", "Tag três", "Tag quatro"]}
        href="#"
        imageSrc={placeholderImage}
        imageAlt="Imagem ilustrativa do case"
      />
      <CaseCardLarge
        number="02"
        title="Case Study Two"
        summary="Uma frase resumindo o problema e o resultado do projeto."
        description="Descrição mais longa explicando o contexto, o problema enfrentado e a abordagem de design utilizada neste case."
        tags={["Tag um", "Tag dois", "Tag três"]}
        href="#"
        imageSrc={placeholderImage}
        imageAlt="Imagem ilustrativa do case"
      />
      <CaseCardLarge
        number="03"
        title="Case Study Three"
        summary="Uma frase resumindo o problema e o resultado do projeto."
        description="Descrição mais longa explicando o contexto, o problema enfrentado e a abordagem de design utilizada neste case."
        tags={["Tag um", "Tag dois"]}
        href="#"
        imageSrc={placeholderImage}
        imageAlt="Imagem ilustrativa do case"
      />
      <CaseCardLarge
        number="04"
        title="Case Study Four (largura customizada)"
        summary="Demonstra o uso da prop opcional maxWidth."
        description="Descrição mais longa explicando o contexto, o problema enfrentado e a abordagem de design utilizada neste case."
        tags={["Tag um", "Tag dois", "Tag três"]}
        href="#"
        imageSrc={placeholderImage}
        imageAlt="Imagem ilustrativa do case"
        maxWidth={600}
      />
    </div>
  ),
};
