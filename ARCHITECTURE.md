```markdown
# System Architecture

This document outlines the technical design, data flow, and synchronization strategies used in the Collaborative Canvas application.

## 1. Data Flow Diagram

The application follows a **Client-Server (Star Topology)** architecture. The Server acts as the central authority for the drawing history.

```mermaid
sequenceDiagram
    participant User A
    participant Server
    participant User B

    Note over User A: Draws a line (mousedown -> mousemove)
    User A->>Server: Emit "draw_line" {x, y, color} (Live)
    Server->>User B: Broadcast "draw_line" {x, y, color}
    Note over User B: User B sees User A's line live

    Note over User A: Finishes stroke (mouseup)
    User A->>Server: Emit "save_stroke" {points: [...]}
    Server->>Server: Push stroke to Global History Array