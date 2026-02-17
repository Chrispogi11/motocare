# Fred AI Assistant (Free RAG Stack) -- MotoCare Context

## Overview

Fred is an AI-powered motorcycle maintenance assistant integrated into
the existing MotoCare web application.

Its purpose is to help riders: - Understand maintenance schedules -
Troubleshoot common issues - Track care best practices - Make smarter
ownership decisions

Fred uses Retrieval Augmented Generation (RAG) to answer questions based
on stored motorcycle knowledge instead of generic AI guesses.

------------------------------------------------------------------------

## Design Goals

-   Simple architecture
-   Free-tier friendly tools
-   No paid OpenAI API required
-   Works inside existing MotoCare stack
-   Expandable knowledge base

------------------------------------------------------------------------

## Existing Infrastructure

Frontend: - React (Vite) deployed on Vercel

Backend: - Node.js + Express deployed on Render

Database: - Supabase Postgres

Fred will plug directly into the current backend.

------------------------------------------------------------------------

## RAG Core Concept

RAG = Search + Generate

Instead of letting an AI guess:

1.  Store motorcycle knowledge in chunks
2.  Convert chunks into vector embeddings
3.  Save vectors in Supabase
4.  When user asks Fred:
    -   Convert question to embedding
    -   Search vector database
    -   Retrieve most relevant chunks
    -   Send chunks + question to LLM
    -   Generate accurate response

------------------------------------------------------------------------

## Recommended Free Tech Stack

Embeddings: - Hugging Face sentence-transformer models

LLM Responses: - Hugging Face Inference API (free tier) - Or Vercel AI
SDK free providers

Vector Database: - Supabase Postgres with pgvector

Backend Logic: - Node + Express (existing)

Frontend: - Simple chat interface on Homepage

------------------------------------------------------------------------

## High-Level Architecture

User → React Chat UI\
→ Express API\
→ Embedding Service\
→ Supabase Vector Search\
→ Retrieve Knowledge\
→ LLM Generation\
→ Response to User

------------------------------------------------------------------------

## Data Structure (Conceptual)

Vector Table: - id - content - embedding - topic - source

Chat Flow: - user_question - retrieved_chunks - ai_answer

------------------------------------------------------------------------

## MVP Feature Scope

-   Homepage chat widget
-   Motorcycle maintenance Q&A
-   RAG-powered retrieval
-   Clean minimal UI

------------------------------------------------------------------------

## Future Enhancements

-   Personalized advice by bike type
-   Service reminders from chat
-   Cost optimization tips
-   Multi-language support
-   Voice assistant

------------------------------------------------------------------------

## Key Principles

-   Accuracy over creativity
-   Simple over complex
-   Free tools first
-   Build incrementally
-   Expand knowledge continuously

------------------------------------------------------------------------

End of Fred RAG Context
