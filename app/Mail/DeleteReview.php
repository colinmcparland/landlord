<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class DeleteReview extends Mailable
{
    use Queueable, SerializesModels;

    public $delete_link;
    public $review_content;
    public $rating;
    public $address;
    public $star;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($delete_link, $rating, $content, $address, $star)
    {
        $this->delete_link = $delete_link;
        $this->review_content = $content;
        $this->rating = $rating;
        $this->address = $address;
        $this->star = $star;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('Rate my Space Confirmation')
                    ->view('emails.deletereview');
    }
}
