<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;


class NewApplication extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    protected $application;
    protected $job;

    public function __construct($application, $job)
    {
        $this->application = $application;
        $this->job = $job;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
                    ->line('The introduction to the notification.')
                    ->action('Notification Action', url('/'))
                    ->line('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'message' => "You have a new application for your job: {$this->job->title}",
            'application_id' => $this->application->application_id,
            'job_id' => $this->job->job_id,
            'from_user_id' => $this->application->applicant_id,
        ];
    }
}
