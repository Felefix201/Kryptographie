use num::traits::Euclid;
use num::{BigInt, One, Zero};

use crate::encryption::math_functions::traits::divisible::Divisible;
use crate::encryption::math_functions::traits::parity::Parity;

/// Implementiert den Schnellexponentiationsalgorithmus.
pub struct FastExponentiation {}

impl FastExponentiation {
    /// Berechnet die Schnellexponentiation für eine Basis `base`, einen Exponent `exponent`
    /// und einen Modulus `modul`.
    ///
    /// # Argumente
    ///
    /// * `base` - Die Basis.
    /// * `exponent` - Der Exponent.
    /// * `modul` - Der Modulus.
    /// * `use_fast` - Gibt an, ob die schnelle Implementierung verwendet werden soll.
    ///
    /// # Rückgabewert
    ///
    /// * Das Ergebnis der Schnellexponentiation.
    ///
    /// # Beispiel
    ///
    /// ```rust
    /// let base = BigInt::from(2);
    /// let exponent = BigInt::from(3);
    /// let modulus = BigInt::from(5);
    ///
    /// let result = FastExponentiation::calculate(&base, &exponent, &modulus, true);
    ///
    /// assert_eq!(result, BigInt::from(3));
    /// ```
    pub fn calculate(base: &BigInt, exponent: &BigInt, modul: &BigInt, use_fast: bool) -> BigInt {
        return if use_fast {
            FastExponentiation::fast(base, exponent, modul)
        } else {
            FastExponentiation::own(base, exponent, modul)
        };
    }

    fn fast(base: &BigInt, exponent: &BigInt, modul: &BigInt) -> BigInt {
        base.modpow(exponent, modul)
    }

    fn own(base: &BigInt, exponent: &BigInt, modul: &BigInt) -> BigInt {
        // Sonderbedingungen der Exponentiation
        if modul.is_one() {
            return BigInt::zero();
        }
        let mut result = BigInt::one();
        let mut base = base.clone();
        let mut exp = exponent.clone();

        while !exp.is_zero() {
            if exp.is_odd() {
                result = (result * &base).rem_euclid(modul);
            }
            base = (&base * &base).rem_euclid(modul);
            exp.half_assign();
        }
        result
    }
}

#[cfg(test)]
mod tests {
    use std::str::FromStr;
    use crate::big_i;
    use super::*;
    #[test]
    fn fast_exponentiation_happy_flow() {
        let base = &big_i!(561563);
        let exponent = &big_i!(1300);
        let modul = &big_i!(564);
        assert_eq!(
            FastExponentiation::calculate(base, exponent, modul, false),
            big_i!(205)
        );

        let base = &big_i!(56156334590832345);
        let exponent = &big_i!(109458390583094852904812340);
        let modul = &big_i!(564234859);
        assert_eq!(
            FastExponentiation::calculate(base, exponent, modul, false),
            big_i!(558376785)
        );
    }

    #[test]
    fn fast_exponentiation_exponent_one() {
        let base = &big_i!(561563);
        let exponent = &big_i!(1);
        let modul = &big_i!(564);
        assert_eq!(
            FastExponentiation::calculate(base, exponent, modul, false),
            big_i!(383)
        );
    }

    #[test]
    fn fast_exponentiation_exponent_zero() {
        let base = &big_i!(561563);
        let exponent = &big_i!(0);
        let modul = &big_i!(564);
        assert_eq!(
            FastExponentiation::calculate(base, exponent, modul, false),
            big_i!(1)
        );
    }

    #[test]
    fn fast_exponentiation_base_zero() {
        let base = &big_i!(0);
        let exponent = &big_i!(561563);
        let modul = &big_i!(564);
        assert_eq!(
            FastExponentiation::calculate(base, exponent, modul, false),
            big_i!(0)
        );
    }

    #[test]
    fn fast_exponentiation_modul_one() {
        let base = &big_i!(3459860);
        let exponent = &big_i!(561563);
        let modul = &big_i!(1);
        assert_eq!(
            FastExponentiation::calculate(base, exponent, modul, false),
            big_i!(0)
        );
    }

    #[test]
    fn fast_exponentiation_big_numbers() {
        let base = &big_i!(3459860).pow(50);
        let exponent = &big_i!(561563).pow(50);
        let modul = &big_i!(345902).pow(50);
        assert_eq!(
            FastExponentiation::calculate(base, exponent, modul, false),
            BigInt::from_str("8408769600151667634624424658533698267981486479206207837400880482584240253227309957477768628293816726387378101618036878012339908404810884160600885622896014991205830046127587869666780551862829518403374323613697514544975024376847169484921172903282824411000834600056510593848311808").unwrap()
        );

        let base = &big_i!(5345890).pow(50);
        let exponent = &big_i!(561563).pow(50);
        let modul = &big_i!(402).pow(453);
        assert_eq!(
            FastExponentiation::calculate(base, exponent, modul, false),
            BigInt::from_str("3865812286670140244135659583582784422868607182053532234892119221318009519049840848928181595205903918350994052685502954280587622821049262028969781448838683538880584872202936321233747460151097175519490133290457481138503925299942681667894197628591512134856836351617429125260375231408269314105167853219462996964862842118589984098650391290176408417243048103776854044821474824889320850667507890395769983356345061882029969478502315374312501247186250351754934295084246986742329795390786311078628530440754856479205141409578653316171690967468840184450509388030981031737577810850620779725958417192948561835194773695941361612225803217565675522961705627046360944634654621872586535332182764197222888226270388954006295237642124544864715066176310557964933132099186352875757363791307327674799516376108738026266118794617758595269081482227829599835454778768141217737588053896979935711190022064516393010329090283156674631737792250605934457811116131051558041088439411741976788375428610551855415643131350851177642819664715803674680663207355557044121133492467414028969595889934382173724212977872023208326609954389561973252556941619801122899324611797790397387249251896640501121328429738301895459647520768").unwrap()
        );

        assert_eq!(
            FastExponentiation::calculate(&big_i!(37), &big_i!(2), &big_i!(89), false),
            big_i!(34)
        )
    }
}
