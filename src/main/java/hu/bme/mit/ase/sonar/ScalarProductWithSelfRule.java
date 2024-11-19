package hu.bme.mit.ase.sonar;

import org.sonar.check.Rule;
import org.sonar.plugins.java.api.IssuableSubscriptionVisitor;
import org.sonar.plugins.java.api.semantic.Symbol;
import org.sonar.plugins.java.api.tree.*;

import java.util.Collections;
import java.util.List;
import java.util.Objects;

@Rule(key = "ScalarProductWithSelfRule")
public class ScalarProductWithSelfRule extends IssuableSubscriptionVisitor {
    private static final String COMPUTE_SCALAR_PRODUCT = "computeScalarProduct";
    private static final String VECTOR_MULTIPLIER = "hu.bme.mit.ase.shingler.lib.VectorMultiplier";

    @Override
    public List<Tree.Kind> nodesToVisit() {
        return Collections.singletonList(Tree.Kind.METHOD_INVOCATION);
    }

    @Override
    public void visitNode(Tree tree) {
        MethodInvocationTree methodInvocation = (MethodInvocationTree) tree;
        if (!isScalarProductMethod(methodInvocation.methodSymbol())) {
            // If this is not a call to computeScalarProduct, do not report an error.
            return;
        }
        Arguments arguments = methodInvocation.arguments();
        if (arguments.size() != 2) {
            // This can only occur in non-compilable code, where we should not report any error.
            return;
        }
        ExpressionTree left = arguments.get(0);
        ExpressionTree right = arguments.get(1);
        if (!isSameVariable(left, right)) {
            // If the two arguments are different, do not report an error.
            return;
        }
        // Find the enclosing method definition.
        Tree parent = methodInvocation.parent();
        while (parent != null && !parent.is(Tree.Kind.METHOD, Tree.Kind.CONSTRUCTOR)) {
            parent = parent.parent();
        }
        if (parent != null && isOwnedByVectorMultiplier(((MethodTree) parent).symbol())) {
            // Allow calls to computeScalarProduct in the definition of computeSquaredNorm.
            return;
        }
        reportIssue(methodInvocation.methodSelect(), "Replace this call with computeSquaredNorm.");
    }

    private static boolean isScalarProductMethod(Symbol.MethodSymbol symbol) {
        if (isScalarProductInterfaceMethod(symbol)) {
            return true;
        }
        return symbol.overriddenSymbols().stream().anyMatch(ScalarProductWithSelfRule::isScalarProductMethod);
    }

    private static boolean isScalarProductInterfaceMethod(Symbol.MethodSymbol symbol) {
        return COMPUTE_SCALAR_PRODUCT.equals(symbol.name()) && isOwnedByVectorMultiplier(symbol);
    }

    private static boolean isOwnedByVectorMultiplier(Symbol.MethodSymbol symbol) {
        Symbol owner = symbol.owner();
        if (owner == null) {
            return false;
        }
        return VECTOR_MULTIPLIER.equals(owner.type().fullyQualifiedName());
    }

    private static boolean isSameVariable(ExpressionTree left, ExpressionTree right) {
        // If we cannot determine is they are different, assume that they are (defaultValue = false),
        // because we prefer a false negative to a false positive.
        if (!left.is(Tree.Kind.IDENTIFIER) || !right.is(Tree.Kind.IDENTIFIER)) {
            return false;
        }
        Symbol leftSymbol = ((IdentifierTree) left).symbol();
        Symbol rightSymbol = ((IdentifierTree) right).symbol();
        if (leftSymbol.isUnknown() || rightSymbol.isUnknown()) {
            return false;
        }
        return Objects.equals(leftSymbol.name(), rightSymbol.name());
    }
}
