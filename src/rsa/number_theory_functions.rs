use std::ops::Div;

///
/// Schnelle Exponentiation der Potenz und Reduzierung um einen Modul.
/// Alternativer Ansatz von Herrn Elsner zur schnellen Exponentiation durch Halbieren der Potenz.
///
/// # Argumente
/// * `base` - Die Basis, von welcher die Potenz berechnet werden soll.
/// * `exponent`- Der Exponent zur Berechnung der Potenz.
/// * `modul` - Der Modul, durch den reduziert werden soll.
///
/// # Beispiel
/// ```
/// fast_exponentiation(95, 130, 7) // => '4'
/// ```
pub fn fast_exponentiation(base: i32, exponent: i32, modul: i32) -> i32 {
    // Sonderbedingungen der Exponentiation
    if exponent == 0 {
        return 1;
    }
    if exponent == 1 {
        return base;
    }

    // Berechnung des Zwischenschrittes mit halbiertem Exponenten.
    let base_to_square = fast_exponentiation(base, exponent.div(2), modul);

    return if exponent % 2 == 1 {
        // Ist der Exponent ungerade, wird die Basis erneut als Faktor herangezogen.
        (base_to_square.pow(2) * base) % modul
    } else {
        // Ist der Exponent gerade, so wird nur quadriert.
        base_to_square.pow(2) % modul
    }
}

pub fn expanded_euclidean_algorithm() {}