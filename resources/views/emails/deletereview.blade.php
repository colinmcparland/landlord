<!DOCTYPE html>
<html>
<head>

<style>
  body {
    display: table-cell;
    vertical-align: middle;
    height: 100vh;
    width: 100vw;
    background-color: #efefef;
    font-family: 'Arial';
  }

  h1, h2, h3, h4 {
    font-weight: 300;
  }

  table {
    margin-left: auto;
    margin-right: auto;
    text-align: center;
    box-shadow:0px 0px 5px #ccc;
    max-width: 540px;
    min-width: 320px;
    padding: 25px;
    border-radius: 4px;
    background-color: #fff;
  }

  a {
    text-align: center;
    background-color: #3097D1;
    border:1px solid #2a88bd;
    border-radius: 4px;
    color: #fff;
    text-decoration: none;
    display: inline-block; 
    transition: 0.3s;
  }

  a:hover {
    background-color: #2579a9;
    border-color: #1f648b;
  }

  h4 {
    margin: 18px 50px;
  }


</style>

</head>
<body>
  <table>
    <tbody>
      <tr>
        <td>
    <h1>Thanks for your review!</h1>
    <p style="margin-bottom: 35px; padding-bottom: 35px; border-bottom: 1px solid #ccc;">Thanks for leaving a review on Rate my Space!  Hold on to this email in case you ever want to delete your review.</p>
    <h3>Review for {{ $address }}</h3>
    <p><strong>Rating</strong></p>
    @for($i = 0; $i < intval($rating); $i++)
      <img src="{{ secure_url('/') . $star }}" alt="{{ $i }} Stars" />
    @endfor
    <p><strong>Review</strong></p>
    <p style="margin-bottom: 35px; padding-bottom: 35px; border-bottom: 1px solid #ccc;">{{ $review_content }}</p>
    <a href="@php echo secure_url('/'); @endphp/delete/{{ $delete_link }}"><h4>Delete Review</h4></a>
    <em><p>Thanks for using Rate my Space!</p></em>
  </td>
    </tr>
  </tbody>
  </table>
</body>
</html>