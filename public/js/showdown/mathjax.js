/* globals Buffer btoa atob */
/* eslint "object-shorthand":0 */

/*
 * Inline MathJax
 *
 *   We use the constant \(\pi\) to compute the area of a circle.
 *
 * Display MathJax
 *
 *   Here is a multi-line equation:
 *
 *   \[
 *    \begin{align}
 *    \dot{x} & = \sigma(y-x) \\
 *    \dot{y} & = \rho x - y - xz \\
 *    \dot{z} & = -\beta z + xy
 *    \end{align}
 *   \]
 *
 * Dont forget to include
 *
 *	<script type="text/javascript"
 * 	src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-MML-AM_HTMLorMML">
 * </script>
 */

( function () {
    var escapehtml = function ( str ) {
      return str.replace
        ( /&/g, '&amp;' )
        .replace ( /</g, '&lt;' )
        .replace ( />/g, '&gt;' )
    }

    var encode = ( function () {
      if ( typeof Buffer === 'function' ) {
        return function ( text ) {
          return ( new Buffer ( text ) ).toString ( 'base64' )
        }
      }
      else {
        return btoa
      }
    }() )

    var decode = ( function () {
      if ( typeof Buffer === 'function' ) {
        return function ( text ) {
          return ( new Buffer ( text, 'base64' ) ).toString ()
        }
      }
      else {
        return atob
      }
    }() )

    var mathjax = function () {
      var ext =
      [ { type: 'lang'
        , filter: function ( text ) {
            // cannot use two 'lang' filters because they break each other.
            return text.replace
            ( /\\\((.*?)\\\)/g
            , function ( match, p1 ) {
                return '<mathxxxjax>' +
                  encode( '\\(' + escapehtml ( p1 ) + '\\)' ) +
                  '</mathxxxjax>'
              }
            )
          }
        }
      , { type: 'lang'
        , filter: function ( text ) {
            // cannot use two 'lang' filters because they break each other.
            return text.replace
            ( /\\\[([\s\S]*?)\\\]/g
            , function ( match, p1 ) {
                return '<mathxxxjax>' +
                  encode( '\\[' + escapehtml ( p1 ) + '\\]' ) +
                  '</mathxxxjax>'
              }
            )
          }
        }
      , { type: 'output'
        , filter: function ( text ) {
            // insert data back
            return text.replace
            ( /<mathxxxjax>(.*?)<\/mathxxxjax>/g
            , function ( match, p1 ) {
                return decode( p1 )
              }
            )
          }
        }

      /*
        , regex: 'xx\\\((.*)\\\)'
        , replace ( match, content ) {
            return '\\\\(' + content + '\\\\)'
          }
        }
      , { type: 'lang'
        , regex: '\\\[(.*?)\\\]'
        , replace ( match, content ) {
            return '\\\\[' + content + '\\\\]'
          }
        }
        */
      ]

      return ext
    }

    // Client-side export
    if ( typeof window !== 'undefined' &&
         window.showdown &&
         window.showdown.extensions ) {
      window.showdown.extensions.mathjax = mathjax
    }
    // Server-side export
    if ( typeof module !== 'undefined' ) {
      module.exports = mathjax
    }
  }()
)
