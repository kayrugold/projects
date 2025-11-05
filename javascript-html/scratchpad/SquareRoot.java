import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Scanner;

public class SquareRoot {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.print("Enter a large number: ");
        String numberString = scanner.next();
        
        try {
            BigDecimal number = new BigDecimal(numberString);

            if (number.compareTo(BigDecimal.ZERO) < 0) {
                System.out.println("Cannot calculate the square root of a negative number.");
            } else {
                BigDecimal squareRoot = sqrt(number);
                System.out.println("The square root of the number is: ");
                System.out.println(squareRoot.toPlainString());
            }

        } catch (NumberFormatException e) {
            System.out.println("Invalid number format. Please enter a valid number without commas.");
        }

        scanner.close();
    }

    /**
     * Calculates the square root of a BigDecimal using Newton's method.
     * @param n The number to calculate the square root of.
     * @return The square root of n.
     */
    public static BigDecimal sqrt(BigDecimal n) {
        final BigDecimal TWO = new BigDecimal(2);
        
        // Use a reasonable initial guess
        BigDecimal x0 = new BigDecimal(Math.sqrt(n.doubleValue()));
        BigDecimal x1 = x0;

        for (int i = 0; i < 100; i++) {
            x1 = n.divide(x0, 100, RoundingMode.HALF_UP).add(x0).divide(TWO, 100, RoundingMode.HALF_UP);
            if (x0.compareTo(x1) == 0) {
                break;
            }
            x0 = x1;
        }
        return x1.setScale(100, RoundingMode.HALF_UP);
    }
}
