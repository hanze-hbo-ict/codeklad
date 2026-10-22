# Data model: editor and runtime state

## Program document

Fields: filename is exactly `main.py`; source is a Unicode string and may be
empty. The editor owns it independently of runtime resets. Save after document
changes and restore from a versioned sessionStorage key. Absence differs from an
empty string; storage failures are visible. Do not persist stdin or output.

## Runtime and execution

States: loading, ready, running, waiting-for-input, stopping, failed.
Only one execution is active. A run ID changes on each new run/reset; obsolete
messages are discarded. Runtime readiness is required before Run. Stop terminates
the current worker, discards its pending input and creates a fresh runtime while
retaining the editor document. Normal reruns use a fresh execution namespace.

## Input request

Identity is the pair (run ID, request ID). One request may be pending per active
run. Data is a Unicode line encoded as UTF-8 in the shared mailbox; an empty line
is valid input. The implementation records a finite byte capacity. Oversize input
is rejected visibly without truncation. Mailbox metadata stores state and byte
length; publish the ready state atomically only after bytes and length are written.

## Output and errors

Ordered stdout/stderr chunks belong to a run ID. Render as text, including prompts
without trailing newlines. Do not interpolate Python output as HTML. Completion
and error events end an execution and release pending input state.

## Theme

Values: system, light, dark. System is initial mode. Manual selection applies
without changing source. Cross-session preference retention is not required.
