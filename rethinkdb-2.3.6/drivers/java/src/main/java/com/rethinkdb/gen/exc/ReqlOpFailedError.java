// Autogenerated by metajava.py.
// Do not edit this file directly.
// The template for this file is located at:
// ../../../../../../../../templates/Exception.java
package com.rethinkdb.gen.exc;

import java.util.Optional;
import com.rethinkdb.ast.ReqlAst;
import com.rethinkdb.model.Backtrace;

public class ReqlOpFailedError extends ReqlAvailabilityError {

    Optional<Backtrace> backtrace = Optional.empty();
    Optional<ReqlAst> term = Optional.empty();

    public ReqlOpFailedError() {
    }

    public ReqlOpFailedError(String message) {
        super(message);
    }

    public ReqlOpFailedError(String format, Object... args) {
        super(String.format(format, args));
    }

    public ReqlOpFailedError(String message, Throwable cause) {
        super(message, cause);
    }

    public ReqlOpFailedError(Throwable cause) {
        super(cause);
    }

    public ReqlOpFailedError(String msg, ReqlAst term, Backtrace bt) {
        super(msg);
        this.backtrace = Optional.ofNullable(bt);
        this.term = Optional.ofNullable(term);
    }

    public ReqlOpFailedError setBacktrace(Backtrace backtrace) {
        this.backtrace = Optional.ofNullable(backtrace);
        return this;
    }

    public Optional<Backtrace> getBacktrace() {
        return backtrace;
    }

    public ReqlOpFailedError setTerm(ReqlAst term) {
        this.term = Optional.ofNullable(term);
        return this;
    }

    public Optional<ReqlAst> getTerm() {
        return this.term;
    }
}
